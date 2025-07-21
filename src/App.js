import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ExternalLink, Calendar, Star, Play, Bookmark, TrendingUp, Eye } from 'lucide-react';

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
    rating: 7.6,
    synopsis: "Mickey Haller runs his law practice from his Lincoln Town Car while handling high-stakes cases in Los Angeles.",
    director: "David E. Kelley",
    seasons: 3,
    hidden_gem: false,
    trending: true,
    international: false,
    historicalAvailability: ["Netflix (2022-present)"],
    streamingUrl: "https://www.netflix.com/title/81303831",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: true,
    analysisUrl: "https://lawyouamerica.com/pop-court/the-lincoln-lawyer"
  },
  {
    id: 2,
    title: "Suits",
    type: "TV Series", 
    year: 2011,
    subgenres: ["Corporate"],
    platform: "Netflix",
    currentlyAvailable: true,
    rating: 8.5,
    synopsis: "A brilliant college dropout works at a top law firm despite never attending law school.",
    director: "Aaron Korsh",
    seasons: 9,
    hidden_gem: false,
    trending: true,
    international: false,
    historicalAvailability: ["USA Network (2011-2019)", "Netflix (2017-present)"],
    streamingUrl: "https://www.netflix.com/title/70195800",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 3,
    title: "Better Call Saul",
    type: "TV Series",
    year: 2015,
    subgenres: ["Criminal"],
    platform: "Netflix",
    currentlyAvailable: true,
    rating: 9.0,
    synopsis: "Prequel to Breaking Bad following Jimmy McGill's transformation into Saul Goodman.",
    director: "Vince Gilligan",
    seasons: 6,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["AMC (2015-2022)", "Netflix (2016-present)"],
    streamingUrl: "https://www.netflix.com/title/80021955",
    platformUrl: "https://www.netflix.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 4,
    title: "The Good Wife",
    type: "TV Series",
    year: 2009,
    subgenres: ["Criminal", "Civil", "Family"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    rating: 8.4,
    synopsis: "Alicia Florrick returns to law after her politician husband's scandal.",
    director: "Robert King",
    seasons: 7,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["CBS (2009-2016)", "Amazon Prime (2018-present)", "Hulu (2020-2023)"],
    streamingUrl: "https://www.amazon.com/The-Good-Wife-Season-1/dp/B0064MGU98",
    platformUrl: "https://www.amazon.com/gp/video/storefront",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 5,
    title: "Silk",
    type: "TV Series",
    year: 2011,
    subgenres: ["Criminal"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    rating: 8.1,
    synopsis: "British barristers compete for silk status at a London chambers.",
    director: "Peter Moffat",
    seasons: 3,
    hidden_gem: true,
    trending: false,
    international: true,
    historicalAvailability: ["BBC One (2011-2014)", "BritBox (2020-present)"],
    streamingUrl: "https://www.amazon.com/Silk-Season-1/dp/B00ESB68HQ",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 6,
    title: "The Split",
    type: "TV Series",
    year: 2018,
    subgenres: ["Family"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    rating: 7.8,
    synopsis: "Family of divorce lawyers navigate professional and personal relationships.",
    director: "Abi Morgan",
    seasons: 3,
    hidden_gem: true,
    trending: false,
    international: true,
    historicalAvailability: ["BBC One (2018-2022)", "BritBox (2021-present)"],
    streamingUrl: "https://www.amazon.com/The-Split-Season-1/dp/B07D21MHBW",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 7,
    title: "Goliath",
    type: "TV Series",
    year: 2016,
    subgenres: ["Civil", "Corporate"],
    platform: "Amazon Prime",
    currentlyAvailable: true,
    rating: 8.2,
    synopsis: "Disgraced lawyer Billy McBride takes on powerful corporations.",
    director: "David E. Kelley",
    seasons: 4,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["Amazon Prime (2016-2021)"],
    streamingUrl: "https://www.amazon.com/Goliath-Season-1/dp/B0875SSWFS",
    platformUrl: "https://www.amazon.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 8,
    title: "Boston Legal",
    type: "TV Series",
    year: 2004,
    subgenres: ["Civil", "Criminal"],
    platform: "Hulu",
    currentlyAvailable: true,
    rating: 8.5,
    synopsis: "Eccentric lawyers Alan Shore and Denny Crane handle unusual cases.",
    director: "David E. Kelley",
    seasons: 5,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["ABC (2004-2008)", "Hulu (2019-present)", "Netflix (2015-2018)"],
    streamingUrl: "https://www.hulu.com/series/boston-legal-2cd2fbc0-6cc2-49d8-a78b-bcd661482db6",
    platformUrl: "https://www.hulu.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 9,
    title: "Ally McBeal",
    type: "TV Series",
    year: 1997,
    subgenres: ["Civil", "Family"],
    platform: "Hulu",
    currentlyAvailable: true,
    rating: 6.8,
    synopsis: "Young lawyer navigates romance and career at Boston law firm.",
    director: "David E. Kelley",
    seasons: 5,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["Fox (1997-2002)", "Netflix (2010-2015)", "Tubi (2020-present)"],
    streamingUrl: "https://www.hulu.com/series/ally-mcbeal-be5f7f99-ad45-40af-986b-550654fb6f52",
    platformUrl: "https://www.hulu.com",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 10,
    title: "The Verdict",
    type: "Movie",
    year: 1982,
    subgenres: ["Civil"],
    platform: "Apple TV+",
    currentlyAvailable: true,
    rating: 7.7,
    synopsis: "An alcoholic lawyer takes on a medical malpractice case that could redeem his career.",
    director: "Sidney Lumet",
    seasons: null,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["HBO Max (2020-present)", "Amazon Prime (2018-2020)"],
    streamingUrl: "https://tv.apple.com/us/movie/the-verdict/umc.cmc.1ur632crpht2qe010rai5iw7d",
    platformUrl: "https://tv.apple.com/",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 11,
    title: "Rake",
    type: "TV Series",
    year: 2010,
    subgenres: ["Criminal"],
    platform: "Pluto TV",
    currentlyAvailable: true,
    rating: 8.6,
    synopsis: "Self-destructive Australian barrister takes on impossible cases.",
    director: "Peter Duncan",
    seasons: 5,
    hidden_gem: true,
    trending: false,
    international: true,
    historicalAvailability: ["ABC Australia (2010-2018)", "Acorn TV (2019-present)", "Netflix (2016-2019)"],
    streamingUrl: "https://pluto.tv/us/on-demand/series/68228748a21058b98fed9a36/season/1?utm_medium=textsearch&utm_source=google",
    platformUrl: "https://pluto.tv/",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 12,
    title: "Your Honor",
    type: "TV Series",
    year: 2020,
    subgenres: ["Criminal", "Family"],
    platform: "Netflix",
    currentlyAvailable: true,
    rating: 7.6,
    synopsis: "A judge compromises his integrity when his son is involved in a hit-and-run.",
    director: "Peter Moffat",
    seasons: 2,
    hidden_gem: false,
    trending: true,
    international: false,
    historicalAvailability: ["Showtime (2020-2023)", "Paramount+ (2021-present)"],
    streamingUrl: "https://www.netflix.com/title/81684531",
    platformUrl: "https://www.netflix.com/",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 13,
    title: "Family Law",
    type: "TV Series",
    year: 2021,
    subgenres: ["Family"],
    platform: "The CW",
    currentlyAvailable: true,
    rating: 7.2,
    synopsis: "Canadian family lawyer rebuilds her career and relationships.",
    director: "Susin Nielsen",
    seasons: 4,
    hidden_gem: true,
    trending: false,
    international: true,
    historicalAvailability: ["CBC (2021-present)", "The CW (2022-present)"],
    streamingUrl: "https://www.cwtv.com/shows/family-law/",
    platformUrl: "https://www.cwtv.com/",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 14,
    title: "A Few Good Men", 
    type: "Movie",
    year: 1992,
    subgenres: ["Criminal"],
    platform: "Pluto TV",
    currentlyAvailable: true,
    rating: 7.7,
    synopsis: "Military lawyers defend Marines accused of murder in this courtroom drama.",
    director: "Rob Reiner",
    seasons: null,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["Netflix (2023-present)", "Amazon Prime (2018-2022)", "Hulu (2016-2020)"],
    streamingUrl: "https://pluto.tv/us/search/details/movies/64c013550a21a300132add4a?utm_medium=textsearch&utm_source=google",
    platformUrl: "https://www.pluto.tv/",
    hasAnalysis: false,
    analysisUrl: null
  },
  {
    id: 15,
    title: "When They See Us",
    type: "Limited Series",
    year: 2019,
    subgenres: ["Criminal"],
    platform: "Netflix",
    currentlyAvailable: true,
    rating: 8.9,
    synopsis: "True story of the Central Park Five and the injustice they faced.",
    director: "Ava DuVernay",
    seasons: 1,
    hidden_gem: false,
    trending: false,
    international: false,
    historicalAvailability: ["Netflix (2019-present)"],
    streamingUrl: "https://www.netflix.com/title/80200549",
    platformUrl: "https://www.netflix.com/",
    hasAnalysis: false,
    analysisUrl: null
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
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all'); // 'all', 'trending', 'hidden-gems', 'international'

  // Filter and search logic
  const filteredContent = useMemo(() => {
    return legalContentDatabase.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.director.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = selectedPlatform === 'All Platforms' || 
                            item.platform === selectedPlatform;
      
      const matchesSubgenre = selectedSubgenre === 'All Subgenres' || 
                            item.subgenres.includes(selectedSubgenre);
      
      const matchesType = selectedType === 'All Types' || item.type === selectedType;

      const matchesView = currentView === 'all' || 
                         (currentView === 'trending' && item.trending) ||
                         (currentView === 'hidden-gems' && item.hidden_gem) ||
                         (currentView === 'international' && item.international);
      
      return matchesSearch && matchesPlatform && matchesSubgenre && matchesType && matchesView;
    });
  }, [searchTerm, selectedPlatform, selectedSubgenre, selectedType, currentView]);

  const trendingCount = legalContentDatabase.filter(item => item.trending).length;
  const hiddenGemCount = legalContentDatabase.filter(item => item.hidden_gem).length;
  const internationalCount = legalContentDatabase.filter(item => item.international).length;

  const getPlatformColor = (platform) => {
    const colors = {
      'Netflix': 'bg-red-600',
      'Amazon Prime': 'bg-blue-600',
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

  const ContentCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.type} • {item.year}</p>
        </div>
        <div className="flex items-center space-x-2">
          {item.trending && <TrendingUp className="w-4 h-4 text-orange-500" title="Trending" />}
          {item.hidden_gem && <Eye className="w-4 h-4 text-purple-500" title="Hidden Gem" />}
          {item.international && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">International</span>}
        </div>
      </div>

      <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-3 ${getPlatformColor(item.platform)}`}>
        {item.platform}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
          {item.seasons && (
            <span className="text-sm text-gray-600">{item.seasons} Season{item.seasons !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
            onClick={() => {
              // Analytics tracking would go here
              if (item.streamingUrl) {
                window.open(item.streamingUrl, '_blank');
              } else {
                window.open(item.platformUrl, '_blank');
              }
            }}
          >
            <Play className="w-4 h-4 mr-1" />
            Watch Now
          </button>
          
          {/* Analysis button - only show if analysis exists */}
          {item.hasAnalysis ? (
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center"
              onClick={() => {
                window.open(item.analysisUrl, '_blank');
              }}
              title="Read our analysis"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          ) : (
            <button 
              className="bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm font-medium flex items-center cursor-not-allowed"
              disabled
              title="Analysis coming soon"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!item.currentlyAvailable && item.historicalAvailability.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Previously available:</strong> {item.historicalAvailability.join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Streaming Directory</h1>
              <p className="text-gray-600 mt-1">Your comprehensive guide to legal dramas, comedies, and documentaries</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <a 
                href="https://lawyouamerica.com" 
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Visit LawyouAmerica.com
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setCurrentView('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentView === 'all' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Content ({legalContentDatabase.length})
            </button>
            <button
              onClick={() => setCurrentView('trending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                currentView === 'trending' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending ({trendingCount})
            </button>
            <button
              onClick={() => setCurrentView('hidden-gems')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                currentView === 'hidden-gems' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 mr-1" />
              Hidden Gems ({hiddenGemCount})
            </button>
            <button
              onClick={() => setCurrentView('international')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentView === 'international' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              International ({internationalCount})
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
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
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No content found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
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
