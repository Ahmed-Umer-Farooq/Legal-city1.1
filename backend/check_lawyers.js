const db = require('./db');

async function checkLawyers() {
  try {
    const total = await db('lawyers').count('id as count').first();
    const verified = await db('lawyers').where({ lawyer_verified: 1 }).count('id as count').first();
    const unverified = await db('lawyers').where({ lawyer_verified: 0 }).count('id as count').first();

    console.log('Total Lawyers:', total.count);
    console.log('Verified Lawyers:', verified.count);
    console.log('Unverified Lawyers:', unverified.count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkLawyers();
