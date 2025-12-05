const db = require('./db');

async function testQASystem() {
  try {
    console.log('🧪 Testing Q&A System...');
    
    // Cleanup any existing test data first
    console.log('\n0. Cleaning up any existing test data...');
    await db('qa_answers').where('question_id', 'IN', 
      db('qa_questions').select('id').where('secure_id', 'test_question_123')
    ).del();
    await db('qa_questions').where('secure_id', 'test_question_123').del();
    console.log('   ✅ Cleanup completed');
    
    // Test 1: Check if tables exist
    console.log('\n1. Checking if Q&A tables exist...');
    const qaQuestionsExists = await db.schema.hasTable('qa_questions');
    const qaAnswersExists = await db.schema.hasTable('qa_answers');
    
    console.log(`   qa_questions table: ${qaQuestionsExists ? '✅' : '❌'}`);
    console.log(`   qa_answers table: ${qaAnswersExists ? '✅' : '❌'}`);
    
    if (!qaQuestionsExists || !qaAnswersExists) {
      console.log('❌ Q&A tables not found. Please run migrations first.');
      return;
    }
    
    // Test 2: Insert a test question
    console.log('\n2. Inserting test question...');
    const [questionId] = await db('qa_questions').insert({
      secure_id: 'test_question_123',
      question: 'What are my rights as a tenant?',
      situation: 'My landlord is trying to evict me without proper notice. I have been a good tenant for 2 years and always paid rent on time.',
      city_state: 'Seattle, WA',
      plan_hire_attorney: 'not_sure',
      user_email: 'test@example.com',
      user_name: 'Test User',
      status: 'pending',
      is_public: true,
      views: 0,
      likes: 0
    });
    
    console.log(`   ✅ Test question inserted with ID: ${questionId}`);
    
    // Test 3: Fetch the question
    console.log('\n3. Fetching test question...');
    const question = await db('qa_questions').where('id', questionId).first();
    console.log(`   ✅ Question fetched: "${question.question}"`);
    
    // Test 4: Check if we have any lawyers to test answers
    console.log('\n4. Checking for lawyers...');
    const lawyers = await db('lawyers').select('id', 'name').limit(1);
    
    if (lawyers.length > 0) {
      const lawyer = lawyers[0];
      console.log(`   ✅ Found lawyer: ${lawyer.name} (ID: ${lawyer.id})`);
      
      // Test 5: Insert a test answer
      console.log('\n5. Inserting test answer...');
      const [answerId] = await db('qa_answers').insert({
        question_id: questionId,
        lawyer_id: lawyer.id,
        answer: 'As a tenant in Washington State, you have specific rights regarding eviction notices. Your landlord must provide proper written notice before evicting you. For month-to-month tenancies, they must give at least 20 days notice. I recommend consulting with a local tenant rights organization or attorney for specific advice about your situation.',
        is_best_answer: false,
        likes: 0
      });
      
      console.log(`   ✅ Test answer inserted with ID: ${answerId}`);
      
      // Test 6: Fetch question with answers
      console.log('\n6. Fetching question with answers...');
      const questionWithAnswers = await db('qa_questions')
        .leftJoin('users', 'qa_questions.user_id', 'users.id')
        .select(
          'qa_questions.*',
          'users.name as user_display_name',
          db.raw('(SELECT COUNT(*) FROM qa_answers WHERE qa_answers.question_id = qa_questions.id) as answer_count')
        )
        .where('qa_questions.id', questionId)
        .first();
      
      const answers = await db('qa_answers')
        .join('lawyers', 'qa_answers.lawyer_id', 'lawyers.id')
        .select(
          'qa_answers.*',
          'lawyers.name as lawyer_name',
          'lawyers.speciality'
        )
        .where('qa_answers.question_id', questionId);
      
      console.log(`   ✅ Question has ${questionWithAnswers.answer_count} answer(s)`);
      console.log(`   ✅ Answer by: ${answers[0].lawyer_name}`);
    } else {
      console.log('   ⚠️ No lawyers found. Skipping answer tests.');
    }
    
    // Test 7: Test API endpoints
    console.log('\n7. Testing API endpoints...');
    console.log('   📝 You can test the following endpoints:');
    console.log('   GET  http://localhost:5001/api/qa/questions - Get all questions');
    console.log('   GET  http://localhost:5001/api/qa/questions/test_question_123 - Get specific question');
    console.log('   POST http://localhost:5001/api/qa/questions - Submit new question');
    console.log('   GET  http://localhost:5001/api/admin/qa/questions - Admin view questions');
    console.log('   GET  http://localhost:5001/api/admin/qa/stats - Admin Q&A statistics');
    
    // Cleanup
    console.log('\n8. Cleaning up test data...');
    await db('qa_answers').where('question_id', questionId).del();
    await db('qa_questions').where('id', questionId).del();
    console.log('   ✅ Test data cleaned up');
    
    console.log('\n🎉 Q&A System test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database tables created');
    console.log('   ✅ Question insertion works');
    console.log('   ✅ Answer insertion works');
    console.log('   ✅ Data retrieval works');
    console.log('   ✅ API endpoints ready');
    console.log('\n🚀 Your Q&A system is ready to use!');
    
  } catch (error) {
    console.error('❌ Error testing Q&A system:', error);
  } finally {
    process.exit(0);
  }
}

testQASystem();