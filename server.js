const { PrismaClient } = require('@prisma/client');
const { queryType, mutationType, stringArg, makeSchema, objectType, nonNull, intArg, fieldAuthorizePlugin } = require('nexus');
const { ApolloServer, AuthenticationError } = require('apollo-server');
const DataLoader = require('dataloader');
const { setFields, setArrayFields } = require('./dataloader');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();



const user = {
    id: "5b85eced-fa40-4dc3-90b5-10885da55a6c", class_id:"9e134b74-4719-4c0a-83ce-05826180d02e", name: "cset", role: "cset"
}

const secretKey = 'yuvan_sankar_raja';
const expiresIn = '10m'; 

const generateToken = async(user) => {
    const token = await jwt.sign(user, secretKey, { expiresIn });
    console.log(token)
    return token;
};

generateToken(user);


const classRoomLoader = new DataLoader(async(ids) => {
    const classRooms = await prisma.classRoom.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return setFields(classRooms, ids);
}, {cache: true});

const teacherLoader = new DataLoader(async(ids) => {
    const teachers = await prisma.teacher.findMany({
        where: {
            class_id: {
                in: ids,
            },
        },
    });
    return setArrayFields(teachers, ids, "class_id");
}, {cache: true});


const studentLoader = new DataLoader(async(ids) => {
    const students = await prisma.student.findMany({
        where: {
            class_id: {
                in: ids,
            },
        },
    });
    return setArrayFields(students, ids, "class_id")
}, {cache: true});



const classRoom = objectType({
    name: 'classRoom',
    definition(t){
        t.string('id');
        t.string('name');
        t.list.field('teacher', {
            type: 'teacher',
            resolve: (parent, _args) => {
                return teacherLoader.load(parent.id);
            }
        });
        t.list.field('student', {
            type: 'student',
            resolve: (parent, _args) => {
                return studentLoader.load(parent.id);
            }
        });
    },
});

const teacher = objectType({
    name: 'teacher',
    definition(t) {
        t.string('id');
        t.string('name');
        t.string('email');
        t.string('class_id');
        t.list.field('student', {
            type: 'student',
            resolve: (parent, _args) => {
                return studentLoader.load(parent.class_id);
            },
        })
    }
})

const student = objectType({
    name: 'student',
    definition(t) {
        t.string('id');
        t.string('name');
        t.string('email');
        t.int('roll_no');
        t.string('class_id');

        t.field('classRoom', {
            type: 'classRoom',
            resolve: (parent, _args) => {
                return classRoomLoader.load(parent.class_id);
            },
        })
    }
})

const query = queryType({
    definition(t) {
        t.list.field('manyClassRoom', {
            type: 'classRoom',

            resolve: () => {
                return prisma.classRoom.findMany();
            },
        });

        t.list.field('manyTeacher', {
            type: 'teacher',
            resolve: () => {
                return prisma.teacher.findMany();
            },
        });

        t.list.field('manyStudent', {
            type: 'student',
            args:{},
            authorize: async(_, args, context) =>await IsCrctTeacher(context),
            resolve: async(_, args,context) => {
                return prisma.student.findMany({
                    where: {
                        class_id: context.token_details.class_id,
                    },
                });
            },
        });
    }
});

const mutation = mutationType({
    definition(t){
        t.field('createClass', {
            type: 'classRoom',
            args: {
                name: nonNull(stringArg()),
                
            },
            resolve: async (_parent, args) => {
                return prisma.classRoom.create({
                    data: {
                        name: args.name,
                        
                    },
                });
            },
        });

        t.field('createTeacher', {
            type: 'teacher',
            args: {
                class_id:nonNull(stringArg()),
                name: nonNull(stringArg()),
                email: nonNull(stringArg())
            },
            resolve: async (_parent, args) => {
                return prisma.teacher.create({
                    data: {
                        class_id: args.class_id,
                        name: args.name,
                        email: args.email,
                    },
                });
            },
        });

        t.field('createStudent', {
            type: 'student',
            args: {
                name: nonNull(stringArg()),
                email: nonNull(stringArg()),
                roll_no: nonNull(intArg()),
                
            },
            authorize: async(_, args, context) =>await IsCrctTeacher(context),
            resolve: async (_parent, args, context) => {
                return prisma.student.create({
                    data: {
                        name: args.name,
                        roll_no: args.roll_no, 
                        email: args.email,  
                        class_id:context.token_details, 
                        
                    },
                });
            },
        });

       
        t.field('deleteStudent', {
            type: 'student',
            args: {
                id: nonNull(stringArg()),
                teacherId: nonNull(stringArg()),
            },
            resolve: async (_parent, args) => {
                studentLoader.clear(args.id)
                const teacher = await prisma.teacher.findUnique({
                    where: {
                      id: args.teacherId,
                    },
                });
                if (!teacher) {
                    throw new Error("Teacher doesn't exist");
                }
                const student = await prisma.student.findUnique({
                    where: {
                      id: args.id,
                    },
                });
                if (!student) {
                    throw new Error("Student doesn't exist");
                }
                if (teacher.class_id !== student.class_id) {
                    throw new Error("The teacher don't have access to delete this student");
                }
                await prisma.student.delete({
                    where: {
                      id: args.id,
                    },
                });
                return student;
            },
        });    
    },
});


const IsCrctTeacher = async(context) => {
    
    // console.log(token);
    try {
               // console.log(teacher);
        const Class= context.decoded.id;
        if(user.id == Class){
            return true;
        }
    } 
    catch (error) {
        throw new AuthenticationError("This teacher doesn't have access to this class");
    }
}


const schema = makeSchema({
    types: [classRoom, teacher, student, query, mutation],
    plugins: [fieldAuthorizePlugin()],
});



const server = new ApolloServer({ 
    schema,
    introspection: true,
    context:  ({ req }) => {
        const token = req.headers.token;
        const decoded = jwt.verify(token, secretKey);
        let token_details = {
            class_id:decoded.class_id,
        }
        return({
        decoded,
        token_details,
        req, 
    });
    },
    classRoomLoader,
    teacherLoader,
    studentLoader,
});



server.listen(8000, () => {
    console.log("running on 8000");
});


