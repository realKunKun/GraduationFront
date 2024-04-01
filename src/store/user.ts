export default {
  state: {
    userId: "", // ID
    username: "", // name
    userPic: "", // pic
    userPassword:"",
  },
  getters: {
    userId: (state) => state.userId,
    username: (state) => state.username,
    userPic: (state) => state.userPic,
    userPassword: (state) => state.userPassword,
  },
  mutations: {
    setUserId: (state, userId) => {
      state.userId = userId;
    },
    setUsername: (state, username) => {
      state.username = username;
    },
    setUserPic: (state, userPic) => {
      state.userPic = userPic;
    },
    setUserPassword: (state, userPassword) => {
      state.userPassword = userPassword;
    },
  },
};
