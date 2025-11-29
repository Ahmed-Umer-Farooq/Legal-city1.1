import React, { useState } from 'react';
import { Plus, Search, MessageCircle, ThumbsUp, User, Clock, Filter } from 'lucide-react';

const QA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [likedQuestions, setLikedQuestions] = useState(new Set());
  const [likedAnswers, setLikedAnswers] = useState(new Set());
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'What are my rights if I was injured in a car accident?',
      category: 'Personal Injury',
      description: 'I was rear-ended at a traffic light and suffered whiplash. The other driver was clearly at fault. What compensation am I entitled to?',
      author: 'John D.',
      date: '2024-12-10',
      answers: 3,
      likes: 12,
      status: 'answered',
      bestAnswer: 'You may be entitled to compensation for medical expenses, lost wages, pain and suffering, and property damage. Contact a personal injury attorney for a free consultation.',
      answersList: [
        { id: 1, author: 'Attorney Sarah Johnson', date: '2024-12-11', content: 'You may be entitled to compensation for medical expenses, lost wages, pain and suffering, and property damage. Contact a personal injury attorney for a free consultation.', likes: 8, isBest: true },
        { id: 2, author: 'Legal Expert Mike', date: '2024-12-11', content: 'Document everything - medical records, police reports, photos of damage. This will strengthen your case significantly.', likes: 5, isBest: false },
        { id: 3, author: 'Attorney Lisa Chen', date: '2024-12-12', content: 'California follows comparative negligence rules. Even if you were partially at fault, you may still recover damages.', likes: 3, isBest: false }
      ]
    },
    {
      id: 2,
      title: 'Can my employer terminate me without cause?',
      category: 'Employment Law',
      description: 'I work in California and my employer wants to let me go without giving any specific reason. Is this legal?',
      author: 'Sarah M.',
      date: '2024-12-12',
      answers: 2,
      likes: 8,
      status: 'answered',
      bestAnswer: 'California is an at-will employment state, meaning employers can terminate employees for any reason or no reason, as long as it\'s not discriminatory or retaliatory.',
      answersList: [
        { id: 1, author: 'Employment Lawyer Tom', date: '2024-12-13', content: 'California is an at-will employment state, meaning employers can terminate employees for any reason or no reason, as long as it\'s not discriminatory or retaliatory.', likes: 6, isBest: true },
        { id: 2, author: 'HR Specialist Jane', date: '2024-12-13', content: 'However, you may be entitled to unemployment benefits. File a claim immediately after termination.', likes: 2, isBest: false }
      ]
    },
    {
      id: 3,
      title: 'How do I create a valid will?',
      category: 'Estate Planning',
      description: 'I want to make sure my assets are distributed according to my wishes. What are the requirements for a valid will?',
      author: 'Robert K.',
      date: '2024-12-14',
      answers: 1,
      likes: 15,
      status: 'pending',
      bestAnswer: null,
      answersList: [
        { id: 1, author: 'Estate Attorney Mark', date: '2024-12-15', content: 'A valid will requires: 1) Written document, 2) Testator signature, 3) Two witness signatures, 4) Mental capacity at signing. Consider consulting an estate planning attorney.', likes: 4, isBest: false }
      ]
    },
    {
      id: 4,
      title: 'What should I include in a business partnership agreement?',
      category: 'Business Law',
      description: 'Starting a business with a friend. What key elements should we include in our partnership agreement?',
      author: 'Lisa T.',
      date: '2024-12-15',
      answers: 0,
      likes: 5,
      status: 'open',
      bestAnswer: null,
      answersList: []
    }
  ]);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    category: '',
    description: ''
  });

  const categories = ['all', 'Personal Injury', 'Employment Law', 'Estate Planning', 'Business Law', 'Family Law', 'Criminal Law'];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAskQuestion = () => {
    if (!newQuestion.title || !newQuestion.category || !newQuestion.description) return;
    
    const question = {
      id: Date.now(),
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      answers: 0,
      likes: 0,
      status: 'open',
      bestAnswer: null,
      ...newQuestion
    };
    
    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', category: '', description: '' });
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Legal Q&A</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: questions.length, color: 'bg-blue-500' },
          { label: 'Answered', value: questions.filter(q => q.status === 'answered').length, color: 'bg-green-500' },
          { label: 'Pending Review', value: questions.filter(q => q.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Open Questions', value: questions.filter(q => q.status === 'open').length, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map(question => (
          <div key={question.id} className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{question.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(question.status)}`}>
                      {question.status}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {question.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{question.description}</p>
                
                {question.bestAnswer && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <h4 className="font-medium text-green-900 mb-2">✓ Best Answer</h4>
                    <p className="text-green-800 text-sm">{question.bestAnswer}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{question.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(question.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{question.answers} answers</span>
                  </div>
                  <button 
                    onClick={() => {
                      const isLiked = likedQuestions.has(question.id);
                      const updatedQuestions = questions.map(q => 
                        q.id === question.id 
                          ? {...q, likes: isLiked ? q.likes - 1 : q.likes + 1}
                          : q
                      );
                      setQuestions(updatedQuestions);
                      
                      if (isLiked) {
                        const newLikedQuestions = new Set(likedQuestions);
                        newLikedQuestions.delete(question.id);
                        setLikedQuestions(newLikedQuestions);
                      } else {
                        setLikedQuestions(new Set([...likedQuestions, question.id]));
                      }
                    }}
                    className={`flex items-center gap-1 transition-colors ${
                      likedQuestions.has(question.id) 
                        ? 'text-blue-600 hover:text-gray-500' 
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedQuestions.has(question.id) ? 'fill-current' : ''}`} />
                    <span>{question.likes} likes</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedQuestion(question);
                  setShowAnswersModal(true);
                }}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Answers ({question.answers})
              </button>
              <button 
                onClick={() => {
                  setSelectedQuestion(question);
                  setShowAnswerModal(true);
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Answer Question
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Answers Modal */}
      {showAnswersModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedQuestion.title}</h3>
                <p className="text-sm text-gray-500">{selectedQuestion.category} • {selectedQuestion.answers} answers</p>
              </div>
              <button
                onClick={() => setShowAnswersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Question</h4>
              <p className="text-gray-700">{selectedQuestion.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>Asked by {selectedQuestion.author}</span>
                <span>{new Date(selectedQuestion.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Answers</h4>
              {selectedQuestion.answersList?.length > 0 ? (
                selectedQuestion.answersList.map(answer => (
                  <div key={answer.id} className={`border rounded-lg p-4 ${answer.isBest ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    {answer.isBest && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 font-medium text-sm">✓ Best Answer</span>
                      </div>
                    )}
                    <p className="text-gray-700 mb-3">{answer.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">{answer.author}</span>
                        <span>{new Date(answer.date).toLocaleDateString()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          const isLiked = likedAnswers.has(answer.id);
                          const updatedQuestions = questions.map(q => 
                            q.id === selectedQuestion.id 
                              ? {
                                  ...q,
                                  answersList: q.answersList.map(a => 
                                    a.id === answer.id 
                                      ? {...a, likes: isLiked ? a.likes - 1 : a.likes + 1}
                                      : a
                                  )
                                }
                              : q
                          );
                          setQuestions(updatedQuestions);
                          setSelectedQuestion({
                            ...selectedQuestion,
                            answersList: selectedQuestion.answersList.map(a => 
                              a.id === answer.id 
                                ? {...a, likes: isLiked ? a.likes - 1 : a.likes + 1}
                                : a
                            )
                          });
                          
                          if (isLiked) {
                            const newLikedAnswers = new Set(likedAnswers);
                            newLikedAnswers.delete(answer.id);
                            setLikedAnswers(newLikedAnswers);
                          } else {
                            setLikedAnswers(new Set([...likedAnswers, answer.id]));
                          }
                        }}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          likedAnswers.has(answer.id) 
                            ? 'text-blue-600 hover:text-gray-500' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedAnswers.has(answer.id) ? 'fill-current' : ''}`} />
                        <span>{answer.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No answers yet. Be the first to answer!</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAnswersModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAnswersModal(false);
                  setShowAnswerModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Answer This Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Question Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Question</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedQuestion.title}</h4>
              <p className="text-sm text-gray-600">{selectedQuestion.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide a helpful and detailed answer..."
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>• Provide accurate legal information</p>
                <p>• Be respectful and professional</p>
                <p>• Include relevant legal precedents if applicable</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAnswerModal(false);
                  setNewAnswer('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newAnswer.trim()) {
                    const updatedQuestions = questions.map(q => 
                      q.id === selectedQuestion.id 
                        ? {
                            ...q,
                            answers: q.answers + 1,
                            status: q.status === 'open' ? 'pending' : q.status,
                            answersList: [
                              ...(q.answersList || []),
                              {
                                id: Date.now(),
                                author: 'You',
                                date: new Date().toISOString().split('T')[0],
                                content: newAnswer,
                                likes: 0,
                                isBest: false
                              }
                            ]
                          }
                        : q
                    );
                    setQuestions(updatedQuestions);
                    setNewAnswer('');
                    setShowAnswerModal(false);
                    alert('Your answer has been submitted successfully!');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask a Legal Question</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What's your legal question?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide as much detail as possible about your situation..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QA;