export default {
  state: {
    token: false, // the user log in or not
    showAside: false, // the sidebar displayed or not
    searchWord: "", // search keywords
    activeNavName: "", // Navigation bar name
  },
  getters: {
    token: (state) => state.token,
    activeNavName: (state) => state.activeNavName,
    showAside: (state) => state.showAside,
    searchWord: (state) => state.searchWord,
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token;
    },
    setActiveNavName: (state, activeNavName) => {
      state.activeNavName = activeNavName;
    },
    setShowAside: (state, showAside) => {
      state.showAside = showAside;
    },
    setSearchWord: (state, searchWord) => {
      state.searchWord = searchWord;
    },
  },
};
