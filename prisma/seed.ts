import { PrismaClient, Role, GoalStatus, Priority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.doe@company.com" },
      update: {},
      create: {
        email: "john.doe@company.com",
        name: "John Doe",
        role: Role.EMPLOYEE,
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.smith@company.com" },
      update: {},
      create: {
        email: "jane.smith@company.com",
        name: "Jane Smith",
        role: Role.EMPLOYEE,
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.johnson@company.com" },
      update: {},
      create: {
        email: "mike.johnson@company.com",
        name: "Mike Johnson",
        role: Role.MANAGER,
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.wilson@company.com" },
      update: {},
      create: {
        email: "sarah.wilson@company.com",
        name: "Sarah Wilson",
        role: Role.HR_MANAGER,
      },
    }),
    prisma.user.upsert({
      where: { email: "alex.brown@company.com" },
      update: {},
      create: {
        email: "alex.brown@company.com",
        name: "Alex Brown",
        role: Role.EMPLOYEE,
      },
    }),
    prisma.user.upsert({
      where: { email: "lisa.davis@company.com" },
      update: {},
      create: {
        email: "lisa.davis@company.com",
        name: "Lisa Davis",
        role: Role.EMPLOYEE,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: "Complete React Training Course",
        description:
          "Finish the advanced React training course and obtain certification. This will help improve frontend development skills and contribute to upcoming projects.",
        status: GoalStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date("2024-03-15"),
        userId: users[0].id, // John Doe
      },
    }),
    prisma.goal.create({
      data: {
        title: "Improve Code Review Process",
        description:
          "Research and implement better code review practices for the team. Include automated tools and establish clear guidelines.",
        status: GoalStatus.NOT_STARTED,
        priority: Priority.MEDIUM,
        dueDate: new Date("2024-02-28"),
        userId: users[1].id, // Jane Smith
      },
    }),
    prisma.goal.create({
      data: {
        title: "Lead Q1 Project Planning",
        description:
          "Coordinate with stakeholders to plan and scope Q1 projects. Ensure proper resource allocation and timeline estimation.",
        status: GoalStatus.COMPLETED,
        priority: Priority.CRITICAL,
        dueDate: new Date("2024-01-31"),
        userId: users[2].id, // Mike Johnson
      },
    }),
    prisma.goal.create({
      data: {
        title: "Implement Team Performance Metrics",
        description:
          "Design and implement a comprehensive performance tracking system for the engineering team.",
        status: GoalStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date("2024-04-01"),
        userId: users[3].id, // Sarah Wilson
      },
    }),
    prisma.goal.create({
      data: {
        title: "Learn TypeScript",
        description:
          "Complete TypeScript fundamentals and apply knowledge to current projects. Focus on type safety and better code documentation.",
        status: GoalStatus.NOT_STARTED,
        priority: Priority.MEDIUM,
        dueDate: new Date("2024-03-30"),
        userId: users[4].id, // Alex Brown
      },
    }),
    prisma.goal.create({
      data: {
        title: "Optimize Database Queries",
        description:
          "Analyze and optimize slow database queries in the main application. Target 50% improvement in response times.",
        status: GoalStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date("2024-02-15"),
        userId: users[5].id, // Lisa Davis
      },
    }),
    prisma.goal.create({
      data: {
        title: "Mentor Junior Developers",
        description:
          "Establish a mentoring program for junior developers. Create learning paths and conduct weekly 1:1 sessions.",
        status: GoalStatus.NOT_STARTED,
        priority: Priority.LOW,
        dueDate: new Date("2024-05-01"),
        userId: users[0].id, // John Doe
      },
    }),
    prisma.goal.create({
      data: {
        title: "Security Audit Implementation",
        description:
          "Conduct comprehensive security audit of all applications and implement recommended fixes.",
        status: GoalStatus.NOT_STARTED,
        priority: Priority.CRITICAL,
        dueDate: new Date("2024-02-20"),
        userId: users[1].id, // Jane Smith
      },
    }),
  ]);

  console.log(`✅ Created ${goals.length} goals`);

  // Create some skills
  const skills = await Promise.all([
    prisma.skill.upsert({
      where: { name: "React" },
      update: {},
      create: {
        name: "React",
        category: "Frontend Development",
        description: "React.js library for building user interfaces",
      },
    }),
    prisma.skill.upsert({
      where: { name: "TypeScript" },
      update: {},
      create: {
        name: "TypeScript",
        category: "Programming Languages",
        description: "Typed superset of JavaScript",
      },
    }),
    prisma.skill.upsert({
      where: { name: "Node.js" },
      update: {},
      create: {
        name: "Node.js",
        category: "Backend Development",
        description: "JavaScript runtime for server-side development",
      },
    }),
    prisma.skill.upsert({
      where: { name: "Database Design" },
      update: {},
      create: {
        name: "Database Design",
        category: "Data Management",
        description: "Designing efficient and scalable database schemas",
      },
    }),
    prisma.skill.upsert({
      where: { name: "Leadership" },
      update: {},
      create: {
        name: "Leadership",
        category: "Soft Skills",
        description: "Leading teams and managing projects effectively",
      },
    }),
  ]);

  console.log(`✅ Created ${skills.length} skills`);

  const userSkills = await Promise.all([
    prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: users[0].id,
          skillId: skills[0].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        skillId: skills[0].id,
        level: 4,
      },
    }),
    prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: users[0].id,
          skillId: skills[1].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        skillId: skills[1].id,
        level: 3,
      },
    }),
    prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: users[2].id,
          skillId: skills[4].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        skillId: skills[4].id,
        level: 5,
      },
    }),
    prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: users[5].id,
          skillId: skills[3].id,
        },
      },
      update: {},
      create: {
        userId: users[5].id,
        skillId: skills[3].id,
        level: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${userSkills.length} user skills`);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
