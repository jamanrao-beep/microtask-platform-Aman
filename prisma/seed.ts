// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.submission.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const adminPass = await bcrypt.hash('admin123', 10)
  const workerPass = await bcrypt.hash('worker123', 10)

  await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@taskpro.com', password: adminPass, role: 'ADMIN' },
  })

  const workers = await Promise.all([
    prisma.user.create({ data: { name: 'Priya Sharma',  email: 'priya@example.com',  password: workerPass, role: 'WORKER' } }),
    prisma.user.create({ data: { name: 'Rahul Verma',   email: 'rahul@example.com',  password: workerPass, role: 'WORKER' } }),
    prisma.user.create({ data: { name: 'Anjali Singh',  email: 'anjali@example.com', password: workerPass, role: 'WORKER' } }),
    prisma.user.create({ data: { name: 'Demo Worker',   email: 'worker@taskpro.com', password: workerPass, role: 'WORKER' } }),
  ])

  await prisma.wallet.create({ data: { userId: workers[0].id, pending: 12.50, approved: 47.80, withdrawn: 120.00 } })
  await prisma.wallet.create({ data: { userId: workers[1].id, pending:  5.00, approved: 23.40, withdrawn:  60.00 } })
  await prisma.wallet.create({ data: { userId: workers[2].id, pending:  8.75, approved: 31.20, withdrawn:  85.00 } })
  await prisma.wallet.create({ data: { userId: workers[3].id, pending:  2.50, approved: 15.00, withdrawn:   0.00 } })

  const tasks = await Promise.all([
    prisma.task.create({ data: {
      title: 'Complete Product Satisfaction Survey',
      description: 'Fill out a 5-minute survey about your online shopping experience.',
      type: 'SURVEY', reward: 0.75, requiredQty: 500, completedQty: 342, status: 'ACTIVE',
      instructions: '1. Click the survey link\n2. Complete all questions honestly\n3. Submit the survey\n4. Take a screenshot of the confirmation page\n5. Paste the confirmation URL as proof',
      proofType: 'URL',
    }}),
    prisma.task.create({ data: {
      title: 'Post a Review on Reddit r/ProductReviews',
      description: 'Write a genuine review of any tech product you own on the subreddit.',
      type: 'REDDIT_POST', reward: 1.50, requiredQty: 200, completedQty: 87, status: 'ACTIVE',
      instructions: '1. Go to r/ProductReviews on Reddit\n2. Write a 100+ word honest review of any tech product\n3. Your Reddit account must be 30+ days old\n4. Submit the post\n5. Paste the direct URL to your post as proof',
      proofType: 'URL',
    }}),
    prisma.task.create({ data: {
      title: 'Collect Local Restaurant Menu Data',
      description: 'Visit 3 local restaurant websites and collect their menu items and prices.',
      type: 'DATA_COLLECTION', reward: 2.00, requiredQty: 150, completedQty: 63, status: 'ACTIVE',
      instructions: '1. Find 3 local restaurant websites in your city\n2. Copy their menu items, descriptions, and prices\n3. Format as: RestaurantName | Item | Price\n4. Paste the data in the text proof box\n5. Must include at least 10 items per restaurant',
      proofType: 'TEXT',
    }}),
    prisma.task.create({ data: {
      title: 'Upvote and Engage on r/technology Posts',
      description: 'Engage with 5 posts on r/technology — upvote and leave a meaningful comment.',
      type: 'REDDIT_UPVOTE', reward: 0.50, requiredQty: 1000, completedQty: 721, status: 'ACTIVE',
      instructions: '1. Go to r/technology on Reddit\n2. Upvote 5 recent posts\n3. Leave a genuine comment (min 20 words) on at least 2 posts\n4. Take a screenshot showing your activity\n5. Upload the screenshot as proof',
      proofType: 'SCREENSHOT',
    }}),
    prisma.task.create({ data: {
      title: 'Review App on Google Play Store',
      description: 'Download, use for 10 minutes, and leave a genuine review for a productivity app.',
      type: 'APP_REVIEW', reward: 1.25, requiredQty: 300, completedQty: 300, status: 'COMPLETED',
      instructions: '1. Download the assigned app from Play Store\n2. Use it for at least 10 minutes\n3. Write a genuine 50+ word review\n4. Rate it honestly\n5. Take a screenshot of your published review',
      proofType: 'SCREENSHOT',
    }}),
    prisma.task.create({ data: {
      title: 'Write Product Description for E-commerce',
      description: 'Write a compelling 150-word product description for a given product.',
      type: 'CONTENT_WRITING', reward: 1.80, requiredQty: 100, completedQty: 34, status: 'ACTIVE',
      instructions: '1. Read the product brief provided\n2. Write a 150-200 word engaging product description\n3. Include key features, benefits, and a call to action\n4. No plagiarism -- must be original\n5. Paste the written description as proof',
      proofType: 'TEXT',
    }}),
  ])

  const statuses = ['APPROVED', 'APPROVED', 'PENDING', 'REJECTED']
  for (const worker of workers.slice(0, 3)) {
    for (let i = 0; i < 3; i++) {
      const task = tasks[i % tasks.length]
      const status = statuses[i % statuses.length]
      await prisma.submission.create({
        data: {
          taskId: task.id,
          userId: worker.id,
          proof: task.proofType === 'URL'
            ? 'https://reddit.com/r/ProductReviews/comments/example'
            : task.proofType === 'TEXT'
            ? 'McDonalds | Big Mac | 180, Fries | 90, Coke | 60'
            : 'screenshot_proof_uploaded.png',
          status,
          note: status === 'REJECTED' ? 'Proof link is broken, please resubmit.' : null,
        },
      })
    }
  }

  console.log('Done! Seeded 4 workers, 6 tasks, 9 submissions')
  console.log('  Admin  -> admin@taskpro.com  / admin123')
  console.log('  Worker -> worker@taskpro.com / worker123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
