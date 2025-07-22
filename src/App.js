import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ExternalLink, Calendar, Gavel, Play, Bookmark, TrendingUp, Eye, Grid, List, Plus, Edit, Save, X, Trash2 } from 'lucide-react';

// Rate limiting for clicks
const rateLimitClicks = () => {
  const now = Date.now();
  const lastClick = localStorage.getItem('lastClick');
  if (lastClick && (now - lastClick) < 1000) {
    return false; // Too fast, ignore click
  }
  localStorage.setItem('lastClick', now);
  return true;
};

// Admin password - change this to your preferred password
const ADMIN_PASSWORD = "lawyou2025";

// Utility functions for localStorage management
const saveContentToStorage = (content) => {
  localStorage.setItem('legalContent', JSON.stringify(content));
};

const loadContentFromStorage = () => {
  const saved = localStorage.getItem('legalContent');
  return saved ? JSON.parse(saved) : legalContentDatabase;
};

const getNextId = (content) => {
  return Math.max(...content.map(item => item.id)) + 1;
};

// Sample comprehensive database with real legal content
const legalContentDatabase = [
  {
    id: 1,
    title: "The Lincoln Lawyer",
    type: "TV Series",
    year: 2022,
    subgenres: ["Criminal", "Civil"],
    platform: "Netflix",
    currentlyAvailable: true,
    validityVerdict: 3, // 1-3 gavels for legal accuracy
    synopsis: "Mickey Haller runs his law practice from his Lincoln Town Car while handling high-stakes cases in Los Angeles.",
    director: "David E. Kelley",
    seasons: 3,
    trending: true,
    international: false,
    historicalAvailability: ["Netflix (2022-present)"],
    streamingUrl: "https://www.netflix.com/title/81303831",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: true,
    analysisUrl: "https://lawyouamerica.com/pop-court/the-lincoln-lawyer",
    imdbUrl: "https://www.imdb.com/title/tt1905885/" // Admin reference only
  },
  {
    id: 2,
    title: "Suits",
    type: "TV Series", 
    year: 2011,
    subgenres: ["Corporate"],
    platform: "Netflix",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "A brilliant college dropout works at a top law firm despite never attending law school.",
    director: "Aaron Korsh",
    seasons: 9,
    trending: true,
    international: false,
    historicalAvailability: ["USA Network (2011-2019)", "Netflix (2017-present)"],
    streamingUrl: "https://www.netflix.com/title/70195800",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt1632701/"
  },
  {
    id: 3,
    title: "Better Call Saul",
    type: "TV Series",
    year: 2015,
    subgenres: ["Criminal"],
    platform: "Netflix",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "Prequel to Breaking Bad following Jimmy McGill's transformation into Saul Goodman.",
    director: "Vince Gilligan",
    seasons: 6,
    trending: false,
    international: false,
    historicalAvailability: ["AMC (2015-2022)", "Netflix (2016-present)"],
    streamingUrl: "https://www.netflix.com/title/80021955",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt3110726/"
  },
  {
    id: 4,
    title: "The Good Wife",
    type: "TV Series",
    year: 2009,
    subgenres: ["Criminal", "Civil", "Family"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "Alicia Florrick returns to law after her politician husband's scandal.",
    director: "Robert King",
    seasons: 7,
    trending: false,
    international: false,
    historicalAvailability: ["CBS (2009-2016)", "Amazon Prime (2018-present)", "Hulu (2020-2023)"],
    streamingUrl: "https://www.amazon.com/The-Good-Wife-Season-1/dp/B0064MGU98",
    platformUrl: "https://www.amazon.com/gp/video/storefront",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt1442462/"
  },
  {
    id: 5,
    title: "Silk",
    type: "TV Series",
    year: 2011,
    subgenres: ["Criminal"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "British barristers compete for silk status at a London chambers.",
    director: "Peter Moffat",
    seasons: 3,
    trending: false,
    international: true,
    historicalAvailability: ["BBC One (2011-2014)", "BritBox (2020-present)"],
    streamingUrl: "https://www.amazon.com/Silk-Season-1/dp/B00ESB68HQ",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt1717157/"
  },
  {
    id: 6,
    title: "The Split",
    type: "TV Series",
    year: 2018,
    subgenres: ["Family"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "Family of divorce lawyers navigate professional and personal relationships.",
    director: "Abi Morgan",
    seasons: 3,
    trending: false,
    international: true,
    historicalAvailability: ["BBC One (2018-2022)", "BritBox (2021-present)"],
    streamingUrl: "https://www.amazon.com/The-Split-Season-1/dp/B07D21MHBW",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt7631058/"
  },
  {
    id: 7,
    title: "Goliath",
    type: "TV Series",
    year: 2016,
    subgenres: ["Civil", "Corporate"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "Disgraced lawyer Billy McBride takes on powerful corporations.",
    director: "David E. Kelley",
    seasons: 4,
    trending: false,
    international: false,
    historicalAvailability: ["Amazon Prime (2016-2021)"],
    streamingUrl: "https://www.amazon.com/Goliath-Season-1/dp/B0875SSWFS",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt4687880/"
  },
  {
    id: 8,
    title: "Boston Legal",
    type: "TV Series",
    year: 2004,
    subgenres: ["Civil", "Criminal"],
    platform: "Hulu",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "Eccentric lawyers Alan Shore and Denny Crane handle unusual cases.",
    director: "David E. Kelley",
    seasons: 5,
    trending: false,
    international: false,
    historicalAvailability: ["ABC (2004-2008)", "Hulu (2019-present)", "Netflix (2015-2018)"],
    streamingUrl: "https://www.hulu.com/series/boston-legal-2cd2fbc0-6cc2-49d8-a78b-bcd661482db6",
    platformUrl: "https://www.hulu.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt0402711/"
  },
  {
    id: 9,
    title: "Ally McBeal",
    type: "TV Series",
    year: 1997,
    subgenres: ["Civil", "Family"],
    platform: "Hulu",
    currentlyAvailable: true,
    validityVerdict: 1,
    synopsis: "Young lawyer navigates romance and career at Boston law firm.",
    director: "David E. Kelley",
    seasons: 5,
    trending: false,
    international: false,
    historicalAvailability: ["Fox (1997-2002)", "Netflix (2010-2015)", "Tubi (2020-present)"],
    streamingUrl: "https://www.hulu.com/series/ally-mcbeal-be5f7f99-ad45-40af-986b-550654fb6f52",
    platformUrl: "https://www.hulu.com",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt0118254/"
  },
  {
    id: 10,
    title: "The Verdict",
    type: "Movie",
    year: 1982,
    subgenres: ["Civil"],
    platform: "Apple TV+",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "An alcoholic lawyer takes on a medical malpractice case that could redeem his career.",
    director: "Sidney Lumet",
    seasons: null,
    trending: false,
    international: false,
    historicalAvailability: ["HBO Max (2020-present)", "Amazon Prime (2018-2020)"],
    streamingUrl: "https://tv.apple.com/us/movie/the-verdict/umc.cmc.1ur632crpht2qe010rai5iw7d",
    platformUrl: "https://tv.apple.com/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt0084855/"
  },
  {
    id: 11,
    title: "Rake",
    type: "TV Series",
    year: 2010,
    subgenres: ["Criminal"],
    platform: "Pluto TV",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "Self-destructive Australian barrister takes on impossible cases.",
    director: "Peter Duncan",
    seasons: 5,
    trending: false,
    international: true,
    historicalAvailability: ["ABC Australia (2010-2018)", "Acorn TV (2019-present)", "Netflix (2016-2019)"],
    streamingUrl: "https://pluto.tv/us/on-demand/series/68228748a21058b98fed9a36/season/1?utm_medium=textsearch&utm_source=google",
    platformUrl: "https://pluto.tv/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt1587000/"
  },
  {
    id: 12,
    title: "Your Honor",
    type: "TV Series",
    year: 2020,
    subgenres: ["Criminal", "Family"],
    platform: "Netflix",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "A judge compromises his integrity when his son is involved in a hit-and-run.",
    director: "Peter Moffat",
    seasons: 2,
    trending: true,
    international: false,
    historicalAvailability: ["Showtime (2020-2023)", "Paramount+ (2021-present)"],
    streamingUrl: "https://www.netflix.com/title/81684531",
    platformUrl: "https://www.netflix.com/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt10844478/"
  },
  {
    id: 13,
    title: "Family Law",
    type: "TV Series",
    year: 2021,
    subgenres: ["Family"],
    platform: "The CW",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "Canadian family lawyer rebuilds her career and relationships.",
    director: "Susin Nielsen",
    seasons: 4,
    trending: false,
    international: true,
    historicalAvailability: ["CBC (2021-present)", "The CW (2022-present)"],
    streamingUrl: "https://www.cwtv.com/shows/family-law/",
    platformUrl: "https://www.cwtv.com/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt13991232/"
  },
  {
    id: 14,
    title: "A Few Good Men", 
    type: "Movie",
    year: 1992,
    subgenres: ["Criminal"],
    platform: "Pluto TV",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "Military lawyers defend Marines accused of murder in this courtroom drama.",
    director: "Rob Reiner",
    seasons: null,
    trending: false,
    international: false,
    historicalAvailability: ["Netflix (2023-present)", "Amazon Prime (2018-2022)", "Hulu (2016-2020)"],
    streamingUrl: "https://pluto.tv/us/search/details/movies/64c013550a21a300132add4a?utm_medium=textsearch&utm_source=google",
    platformUrl: "https://www.pluto.tv/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt0104257/"
  },
  {
    id: 15,
    title: "When They See Us",
    type: "Limited Series",
    year: 2019,
    subgenres: ["Criminal"],
    platform: "Netflix",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "True story of the Central Park Five and the injustice they faced.",
    director: "Ava DuVernay",
    seasons: 1,
    trending: false,
    international: false,
    historicalAvailability: ["Netflix (2019-present)"],
    streamingUrl: "https://www.netflix.com/title/80200549",
    platformUrl: "https://www.netflix.com/",
    hasAnalysis: false,
    analysisUrl: null,
    imdbUrl: "https://www.imdb.com/title/tt7137906/"
  },
  {
    id: 16,
    title: "Anatomy of a Fall",
    type: "Movie",
    year: 2023,
    subgenres: ["Criminal", "International"],
    platform: "Hulu",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "A woman is suspected of murder after her husband's death.",
    director: "Justine Triet",
    seasons: null,
    trending: false,
    international: true,
    historicalAvailability: null,
    streamingUrl: "https://www.hulu.com/movie/anatomy-of-a-fall-94f53938-6240-42b4-abef-8be1d1c39d72",
    platformUrl: "https://www.hulu.com/",
    hasAnalysis: true,
    analysisUrl: "https://lawyouamerica.com/anatomy-of-a-fall/",
    imdbUrl: "https://www.imdb.com/title/tt17009710/"
  },
  {
    id: 17,
    title: "The Trial",
    type: "Movie",
    year: 1962,
    subgenres: ["Criminal"],
    platform: "Amazon",
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: "A man is arrested and stands trial, but he is never made aware of the charges against him.",
    director: "Orson Welles",
    seasons: null,
    trending: false,
    international: false,
    historicalAvailability: null,
    streamingUrl: "https://www.amazon.com/Trial-Jess-Hahn/dp/B0CC7SFQJW",
    platformUrl: "https://www.amazon.com/",
    hasAnalysis: true,
    analysisUrl: "https://lawyouamerica.com/the-trial-by-kafka/",
    imdbUrl: "https://www.imdb.com/title/tt0057427/"
  },
  {
    id: 18,
    title: "Marshall",
    type: "Movie",
    year: 2017,
    subgenres: ["Criminal"],
    platform: "HBO Max",
    currentlyAvailable: true,
    validityVerdict: 3,
    synopsis: "Thurgood Marshall, who would become the first African-American Supreme Court Justice, battles through one of his career-defining cases.",
    director: "Reginald Hudlin",
    seasons: null,
    trending: false,
    international: false,
    historicalAvailability: null,
    streamingUrl: "https://www.hbomax.com/movies/marshall/efca3fd1-0400-480b-896e-031fe850e02e",
    platformUrl: "https://www.hbomax.com/",
    hasAnalysis: true,
    analysisUrl: "https://lawyouamerica.com/marshall-movie/",
    imdbUrl: "https://www.imdb.com/title/tt1504320/"
  }
];

const platforms = [
  'All Platforms', 'Netflix', 'Amazon Prime', 'Hulu', 'HBO Max', 
  'Apple TV+', 'Paramount+', 'MGM+', 'BritBox', 'Acorn TV', 
  'Tubi', 'Roku Channel', 'Pluto TV', 'Freevee', 'Plex', 'Kanopy', 'The CW'
];

const subgenres = ['All Subgenres', 'Criminal', 'Civil', 'Corporate', 'Family'];
const contentTypes = ['All Types', 'TV Series', 'Movie', 'Limited Series'];

function LegalStreamingDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedSubgenre, setSelectedSubgenre] = useState('All Subgenres');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('title-asc');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  // Admin panel state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [contentData, setContentData] = useState(() => loadContentFromStorage());

  // Form state for adding/editing content
  const [formData, setFormData] = useState({
    title: '',
    type: 'TV Series',
    year: new Date().getFullYear(),
    subgenres: [],
    platform: 'Netflix',
    currentlyAvailable: true,
    validityVerdict: 2,
    synopsis: '',
    director: '',
    seasons: null,
    trending: false,
    international: false,
    historicalAvailability: [],
    streamingUrl: '',
    platformUrl: '',
    hasAnalysis: false,
    analysisUrl: '',
    imdbUrl: ''
  });

  // Filter and search logic
  const filteredContent = useMemo(() => {
    let filtered = contentData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.director.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = selectedPlatform === 'All Platforms' || 
                            item.platform === selectedPlatform;
      
      const matchesSubgenre = selectedSubgenre === 'All Subgenres' || 
                            item.subgenres.includes(selectedSubgenre);
      
      const matchesType = selectedType === 'All Types' || item.type === selectedType;
      
      return matchesSearch && matchesPlatform && matchesSubgenre && matchesType;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'year-newest':
          return b.year - a.year;
        case 'year-oldest':
          return a.year - b.year;
        case 'rating-high':
          return b.validityVerdict - a.validityVerdict;
        case 'rating-low':
          return a.validityVerdict - b.validityVerdict;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedPlatform, selectedSubgenre, selectedType, sortBy, contentData]);

  const trendingCount = contentData.filter(item => item.trending).length;
  const internationalCount = contentData.filter(item => item.international).length;

  // Admin functions
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowLogin(false);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setShowAddForm(false);
    setEditingItem(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'TV Series',
      year: new Date().getFullYear(),
      subgenres: [],
      platform: 'Netflix',
      currentlyAvailable: true,
      validityVerdict: 2,
      synopsis: '',
      director: '',
      seasons: null,
      trending: false,
      international: false,
      historicalAvailability: [],
      streamingUrl: '',
      platformUrl: '',
      hasAnalysis: false,
      analysisUrl: '',
      imdbUrl: ''
    });
  };

  const handleAddContent = () => {
    const newContent = {
      ...formData,
      id: getNextId(contentData),
      historicalAvailability: formData.historicalAvailability.filter(h => h.trim())
    };
    
    const updatedContent = [...contentData, newContent];
    setContentData(updatedContent);
    saveContentToStorage(updatedContent);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditContent = (item) => {
    setEditingItem(item.id);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleUpdateContent = () => {
    const updatedContent = contentData.map(item => 
      item.id === editingItem ? { ...formData, id: editingItem } : item
    );
    setContentData(updatedContent);
    saveContentToStorage(updatedContent);
    setShowAddForm(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteContent = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedContent = contentData.filter(item => item.id !== id);
      setContentData(updatedContent);
      saveContentToStorage(updatedContent);
    }
  };

  const handleSubgenreChange = (subgenre) => {
    const newSubgenres = formData.subgenres.includes(subgenre)
      ? formData.subgenres.filter(s => s !== subgenre)
      : [...formData.subgenres, subgenre];
    setFormData({ ...formData, subgenres: newSubgenres });
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Netflix': 'bg-red-600',
      'Amazon Prime': 'bg-blue-600',
      'Amazon': 'bg-blue-600',
      'Hulu': 'bg-green-600',
      'HBO Max': 'bg-purple-600',
      'Apple TV+': 'bg-gray-800',
      'Paramount+': 'bg-blue-500',
      'BritBox': 'bg-indigo-600',
      'Pluto TV': 'bg-orange-600',
      'Tubi': 'bg-yellow-600',
      'The CW': 'bg-emerald-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  const AdminForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="TV Series">TV Series</option>
                  <option value="Movie">Movie</option>
                  <option value="Limited Series">Limited Series</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1900"
                  max="2030"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Specialties</label>
              <div className="flex flex-wrap gap-2">
                {['Criminal', 'Civil', 'Corporate', 'Family'].map(specialty => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subgenres.includes(specialty)}
                      onChange={() => handleSubgenreChange(specialty)}
                      className="mr-2"
                    />
                    {specialty}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {platforms.slice(1).map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity Verdict (1-3 gavels)</label>
                <select
                  value={formData.validityVerdict}
                  onChange={(e) => setFormData({ ...formData, validityVerdict: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>1 Gavel (Low Accuracy)</option>
                  <option value={2}>2 Gavels (Medium Accuracy)</option>
                  <option value={3}>3 Gavels (High Accuracy)</option>
                </select>
              </div>
            </div>

            {formData.type !== 'Movie' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seasons</label>
                <input
                  type="number"
                  value={formData.seasons || ''}
                  onChange={(e) => setFormData({ ...formData, seasons: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Synopsis *</label>
              <textarea
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Streaming URL</label>
              <input
                type="url"
                value={formData.streamingUrl}
                onChange={(e) => setFormData({ ...formData, streamingUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform URL</label>
              <input
                type="url"
                value={formData.platformUrl}
                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IMDB URL (Admin Reference)</label>
              <div className="flex">
                <input
                  type="url"
                  value={formData.imdbUrl}
                  onChange={(e) => setFormData({ ...formData, imdbUrl: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://www.imdb.com/title/..."
                />
                {formData.imdbUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(formData.imdbUrl, '_blank')}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600"
                    title="Open IMDB page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasAnalysis}
                  onChange={(e) => setFormData({ ...formData, hasAnalysis: e.target.checked })}
                  className="mr-2"
                />
                Has LawYou Analysis
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="mr-2"
                />
                Trending
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.international}
                  onChange={(e) => setFormData({ ...formData, international: e.target.checked })}
                  className="mr-2"
                />
                International
              </label>
            </div>

            {formData.hasAnalysis && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Analysis URL</label>
                <input
                  type="url"
                  value={formData.analysisUrl}
                  onChange={(e) => setFormData({ ...formData, analysisUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://lawyouamerica.com/..."
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={editingItem ? handleUpdateContent : handleAddContent}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingItem ? 'Update' : 'Add'} Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ValidityVerdict = ({ rating }) => {
    const gavels = [];
    for (let i = 1; i <= 3; i++) {
      gavels.push(
        <Gavel 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'text-amber-500' : 'text-gray-300'}`} 
        />
      );
    }
    return (
      <div className="flex items-center" title={`Legal Accuracy: ${rating}/3 gavels`}>
        {gavels}
      </div>
    );
  };

  const ContentCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      {isAdminMode && (
        <div className="flex justify-end space-x-2 mb-3">
          <button
            onClick={() => handleEditContent(item)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteContent(item.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {item.imdbUrl && (
            <button
              onClick={() => window.open(item.imdbUrl, '_blank')}
              className="text-yellow-600 hover:text-yellow-800 p-1"
              title="View on IMDB"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
          <div className="flex items-center space-x-3">
            <p className="text-sm text-gray-600">{item.type} • {item.year}</p>
            {item.hasAnalysis ? (
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center"
                onClick={() => {
                  if (!rateLimitClicks()) return;
                  window.open(item.analysisUrl, '_blank');
                }}
                title="Read our analysis"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                LawYou's Take
              </button>
            ) : (
              <button 
                className="bg-gray-300 text-gray-500 px-2 py-1 rounded text-xs font-medium flex items-center cursor-not-allowed"
                disabled
                title="Analysis coming soon"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                LawYou's Take
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.trending && <TrendingUp className="w-4 h-4 text-orange-500" title="Trending" />}
          {item.international && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">International</span>}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {item.subgenres.map(subgenre => (
            <span key={subgenre} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {subgenre}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{item.synopsis}</p>

      <p className="text-gray-700 text-sm mb-4">
        <span className="font-medium">LawYou's Validity Verdict: </span>
        <span className="inline-flex items-center ml-1">
          <ValidityVerdict rating={item.validityVerdict} />
        </span>
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {item.seasons && (
            <span className="text-sm text-gray-600">{item.seasons} Season{item.seasons !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`hover:opacity-90 text-white px-4 py-2 rounded text-sm font-medium flex items-center ${getPlatformColor(item.platform)}`}
            onClick={() => {
              if (!rateLimitClicks()) return;
              
              if (item.streamingUrl) {
                window.open(item.streamingUrl, '_blank');
              } else {
                window.open(item.platformUrl, '_blank');
              }
            }}
          >
            <Play className="w-4 h-4 mr-1" />
            {item.platform}
          </button>
        </div>
      </div>

      {!item.currentlyAvailable && item.historicalAvailability && item.historicalAvailability.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Previously available:</strong> {item.historicalAvailability.join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  const ContentListItem = ({ item }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
              <span className="text-sm text-gray-500">({item.year})</span>
              {item.hasAnalysis ? (
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center"
                  onClick={() => {
                    if (!rateLimitClicks()) return;
                    window.open(item.analysisUrl, '_blank');
                  }}
                  title="Read our analysis"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  LawYou's Take
                </button>
              ) : (
                <button 
                  className="bg-gray-300 text-gray-500 px-2 py-1 rounded text-xs font-medium flex items-center cursor-not-allowed"
                  disabled
                  title="Analysis coming soon"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  LawYou's Take
                </button>
              )}
              {item.trending && <TrendingUp className="w-4 h-4 text-orange-500" title="Trending" />}
              {item.international && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">International</span>}
            </div>
            <div className="flex items-center space-x-4 mb-2">
              {item.seasons && (
                <span className="text-sm text-gray-600">{item.seasons} Season{item.seasons !== 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.subgenres.map(subgenre => (
                <span key={subgenre} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {subgenre}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.synopsis}</p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">LawYou's Validity Verdict: </span>
              <span className="inline-flex items-center ml-1">
                <ValidityVerdict rating={item.validityVerdict} />
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button 
            className={`hover:opacity-90 text-white px-3 py-2 rounded text-sm font-medium flex items-center ${getPlatformColor(item.platform)}`}
            onClick={() => {
              if (!rateLimitClicks()) return;
              
              if (item.streamingUrl) {
                window.open(item.streamingUrl, '_blank');
              } else {
                window.open(item.platformUrl, '_blank');
              }
            }}
          >
            <Play className="w-4 h-4 mr-1" />
            {item.platform}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Streaming Directory</h1>
              <p className="text-gray-600 mt-1">Your comprehensive guide to legal dramas, comedies, and documentaries</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {isAdminMode ? (
                <>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                  <span className="text-sm text-gray-600">Admin Mode</span>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Login</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowLogin(false);
                  setAdminPassword('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && <AdminForm />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by title, synopsis, or director..."
                  value={searchTerm}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[<>]/g, '').trim();
                    setSearchTerm(sanitized);
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${showFilters ? 'bg-gray-100' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Specialty</label>
                <select
                  value={selectedSubgenre}
                  onChange={(e) => setSelectedSubgenre(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {subgenres.map(subgenre => (
                    <option key={subgenre} value={subgenre}>{subgenre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {contentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="year-newest">Newest First</option>
                  <option value="year-oldest">Oldest First</option>
                  <option value="rating-high">Most Accurate</option>
                  <option value="rating-low">Least Accurate</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No content found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {isAdminMode && <span className="ml-2 text-indigo-600 font-medium">(Admin Mode Active)</span>}
              </p>
              <div className="text-sm text-gray-500">
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContent.map(item => (
                  <ContentListItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Part of the <a href="https://lawyouamerica.com" className="text-indigo-600 hover:text-indigo-500">LawyouAmerica.com</a> Pop-Court series
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Discover more legal insights and entertainment analysis on our main site
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LegalStreamingDirectory;
