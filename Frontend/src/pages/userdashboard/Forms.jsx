import React, { useState } from 'react';
import { Search, Download, Eye, FileText, Plus, Filter } from 'lucide-react';

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [customRequest, setCustomRequest] = useState({
    title: '',
    category: '',
    description: '',
    urgency: 'normal',
    contactEmail: '',
    additionalNotes: ''
  });
  const [forms] = useState([
    {
      id: 1,
      title: 'Power of Attorney Form',
      category: 'Estate Planning',
      description: 'Legal document granting authority to act on behalf of another person',
      pages: 3,
      downloadCount: 245,
      lastUpdated: '2024-11-15',
      fileSize: '2.1 MB',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Employment Contract Template',
      category: 'Employment Law',
      description: 'Standard employment agreement template with customizable terms',
      pages: 8,
      downloadCount: 189,
      lastUpdated: '2024-11-20',
      fileSize: '1.8 MB',
      type: 'PDF'
    },
    {
      id: 3,
      title: 'Divorce Petition Form',
      category: 'Family Law',
      description: 'Official petition form for filing divorce proceedings',
      pages: 12,
      downloadCount: 156,
      lastUpdated: '2024-11-10',
      fileSize: '3.2 MB',
      type: 'PDF'
    },
    {
      id: 4,
      title: 'Non-Disclosure Agreement',
      category: 'Business Law',
      description: 'Confidentiality agreement for protecting sensitive information',
      pages: 4,
      downloadCount: 312,
      lastUpdated: '2024-11-25',
      fileSize: '1.5 MB',
      type: 'PDF'
    },
    {
      id: 5,
      title: 'Personal Injury Claim Form',
      category: 'Personal Injury',
      description: 'Comprehensive form for filing personal injury claims',
      pages: 6,
      downloadCount: 98,
      lastUpdated: '2024-11-18',
      fileSize: '2.7 MB',
      type: 'PDF'
    },
    {
      id: 6,
      title: 'Will and Testament Template',
      category: 'Estate Planning',
      description: 'Last will and testament document template',
      pages: 5,
      downloadCount: 203,
      lastUpdated: '2024-11-12',
      fileSize: '2.0 MB',
      type: 'PDF'
    }
  ]);

  const categories = ['all', 'Estate Planning', 'Employment Law', 'Family Law', 'Business Law', 'Personal Injury'];

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || form.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (form) => {
    alert(`Downloading ${form.title}...`);
  };

  const handlePreview = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Legal Forms</h1>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Request Custom Form
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Forms', value: forms.length, color: 'bg-blue-500' },
          { label: 'Categories', value: categories.length - 1, color: 'bg-green-500' },
          { label: 'Downloads', value: forms.reduce((sum, form) => sum + form.downloadCount, 0), color: 'bg-purple-500' },
          { label: 'Recent Updates', value: forms.filter(f => new Date(f.lastUpdated) > new Date('2024-11-15')).length, color: 'bg-orange-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <FileText className="w-5 h-5 text-white" />
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
              placeholder="Search forms..."
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

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map(form => (
          <div key={form.id} className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {form.category}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{form.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pages: {form.pages}</span>
                <span>Size: {form.fileSize}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Downloads: {form.downloadCount}</span>
                <span>Updated: {new Date(form.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePreview(form)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => handleDownload(form)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Form Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Custom Form</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={customRequest.title}
                  onChange={(e) => setCustomRequest({...customRequest, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What type of form do you need?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Category</label>
                <select
                  value={customRequest.category}
                  onChange={(e) => setCustomRequest({...customRequest, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Estate Planning">Estate Planning</option>
                  <option value="Employment Law">Employment Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Business Law">Business Law</option>
                  <option value="Personal Injury">Personal Injury</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={customRequest.description}
                  onChange={(e) => setCustomRequest({...customRequest, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the specific form requirements..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={customRequest.urgency}
                    onChange={(e) => setCustomRequest({...customRequest, urgency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low (7+ days)</option>
                    <option value="normal">Normal (3-7 days)</option>
                    <option value="high">High (1-3 days)</option>
                    <option value="urgent">Urgent (24 hours)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={customRequest.contactEmail}
                    onChange={(e) => setCustomRequest({...customRequest, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={customRequest.additionalNotes}
                  onChange={(e) => setCustomRequest({...customRequest, additionalNotes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific requirements or deadlines..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customRequest.title && customRequest.category && customRequest.contactEmail) {
                    alert(`Custom form request submitted successfully!\n\nTitle: ${customRequest.title}\nCategory: ${customRequest.category}\nUrgency: ${customRequest.urgency}\n\nOur legal team will contact you within 24 hours.`);
                    setCustomRequest({ title: '', category: '', description: '', urgency: 'normal', contactEmail: '', additionalNotes: '' });
                    setShowRequestModal(false);
                  } else {
                    alert('Please fill in all required fields (Title, Category, and Email)');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedForm.title}</h3>
                <p className="text-sm text-gray-500">{selectedForm.category}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedForm.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Document Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Pages: {selectedForm.pages}</p>
                    <p>File Size: {selectedForm.fileSize}</p>
                    <p>Format: {selectedForm.type}</p>
                    <p>Downloads: {selectedForm.downloadCount}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                  <p className="text-sm text-gray-600">{new Date(selectedForm.lastUpdated).toLocaleDateString()}</p>
                  <div className="mt-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      ✓ Current Version
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Usage Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Download the form in PDF format</li>
                  <li>• Fill out all required fields completely</li>
                  <li>• Review with your legal counsel if needed</li>
                  <li>• Submit to appropriate authorities or parties</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedForm);
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;