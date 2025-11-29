import React, { useState } from 'react';
import { Upload, File, Search, Filter, FolderOpen, Download } from 'lucide-react';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Mock documents data
  const documents = [
    { id: 1, name: 'Contract_Agreement.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15', case: 'Case #001' },
    { id: 2, name: 'Legal_Brief.docx', type: 'docx', size: '1.8 MB', date: '2024-01-14', case: 'Case #002' },
    { id: 3, name: 'Evidence_Photos.zip', type: 'zip', size: '15.2 MB', date: '2024-01-13', case: 'Case #001' },
    { id: 4, name: 'Client_Statement.pdf', type: 'pdf', size: '890 KB', date: '2024-01-12', case: 'Case #003' },
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getFileIcon = (type) => {
    return <File className="w-5 h-5 text-[#737791]" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#181A2A]">Documents</h1>
          <p className="text-[#737791] mt-1">Manage your legal documents and files</p>
        </div>
        <button 
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#28B779] text-white px-4 py-2 rounded-lg hover:bg-[#229966] disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.txt"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737791] w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#F8F9FA] rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#737791]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-[#F8F9FA] rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="zip">Archive</option>
              <option value="jpg">Image</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F8F9FA] shadow-md">
          <div className="p-6 border-b border-[#F8F9FA]">
            <h2 className="text-lg font-semibold text-[#181A2A]">All Documents ({filteredDocuments.length})</h2>
          </div>
          <div className="p-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-[#737791] mx-auto mb-4" />
                <p className="text-[#737791]">No documents found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-[#F8F9FA] rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <h3 className="font-medium text-[#181A2A]">{doc.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-[#737791]">
                          <span>{doc.size}</span>
                          <span>{doc.date}</span>
                          <span>{doc.case}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#737791] hover:text-[#0086CB] hover:bg-[#F8F9FA] rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md">
          <div className="p-6 border-b border-[#F8F9FA]">
            <h2 className="text-lg font-semibold text-[#181A2A]">Quick Stats</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center p-4 border border-[#F8F9FA] rounded-lg">
              <h3 className="text-xl font-bold text-[#181A2A]">{documents.length}</h3>
              <p className="text-[#737791] text-sm">Total Documents</p>
            </div>
            <div className="text-center p-4 border border-[#F8F9FA] rounded-lg">
              <h3 className="text-xl font-bold text-[#181A2A]">24.8 MB</h3>
              <p className="text-[#737791] text-sm">Storage Used</p>
            </div>
            <div className="text-center p-4 border border-[#F8F9FA] rounded-lg">
              <h3 className="text-xl font-bold text-[#181A2A]">3</h3>
              <p className="text-[#737791] text-sm">Active Cases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#181A2A] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border border-[#F8F9FA] rounded-lg">
            <Upload className="w-5 h-5 text-[#28B779]" />
            <div>
              <p className="text-sm font-medium text-[#181A2A]">Contract_Agreement.pdf uploaded</p>
              <p className="text-xs text-[#737791]">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-[#F8F9FA] rounded-lg">
            <Download className="w-5 h-5 text-[#0086CB]" />
            <div>
              <p className="text-sm font-medium text-[#181A2A]">Legal_Brief.docx downloaded</p>
              <p className="text-xs text-[#737791]">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}