// Without JWT

const { PrismaClient } = require('@prisma/client');
const { queryType, mutationType, stringArg, makeSchema, objectType, nonNull, plugin, fieldAuthorizePlugin, intArg } = require('nexus');
const { ApolloServer } = require('apollo-server');
const DataLoader = require('dataloader');
const { setFields, setArrayFields } = require('./dataloader');
// const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

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
            resolve: () => {
                return prisma.student.findMany();
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
                class_id:nonNull(stringArg()),

            },
            resolve: async (_parent, args) => {
                return prisma.student.create({
                    data: {
                        name: args.name,
                        email: args.email,
                        roll_no: args.roll_no, 
                        class_id: args.class_id,    
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
                    // Clear the cache for the specified student
                    studentLoader.clear(args.id);

                  // Check if the teacher is associated with the student's class
                  const teacher = await prisma.teacher.findUnique({
                    where: {
                      id: args.teacherId,
                    },
                  });
          
                  if (!teacher) {
                    throw new Error('Teacher not found');
                  }
          
                  // Retrieve the student by ID
                  const student = await prisma.student.findUnique({
                    where: {
                      id: args.id,
                    },
                  });
          
                  if (!student) {
                    throw new Error('Student not found');
                  }
          
                  // Check if the teacher and student belong to the same class
                  if (teacher.class_id !== student.class_id) {
                    throw new Error('Teacher is not authorized to delete this student');
                  }
          
                  // Delete the student
                  await prisma.student.delete({
                    where: {
                      id: args.id,
                    },
                  });
          
                  return student;
                },
        });
            
        
          
    }
});

const schema = makeSchema({
    types: [classRoom, teacher, student, query, mutation],
    plugins : [fieldAuthorizePlugin()]
});

const server = new ApolloServer({ 
    schema,
    context: ({ req }) => ({
        req: req,
    }),
    classRoomLoader,
    teacherLoader,
    studentLoader,
});

server.listen(8000, () => {
    console.log("running on 8000");
});

// // Assuming you have the student ID you want to clear from the cache
// const studentId = "your-student-id";

// // Clear the cache for the specified student
// studentLoader.clear(studentId);

