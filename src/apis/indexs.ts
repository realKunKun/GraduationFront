import { getBaseURL, get, post, deletes } from "./request";

const HttpManager = {
    // Get picture information
    attachImageUrl: (url) => url ? `${getBaseURL()}/${url}` : "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
    //User part
    // Register
    SignUp: (params) => post(`auth/register`, params),
    // Log in
    signIn:(params) => post('auth/login',params),
    // Return special user
    getUserOfId: (id) => get(`user/getUserBy/${id}`),
    getUserOfName:(name) => get(`user/getByName/${name}`),
    // Delete user
    deleteUser: (id) => get(`user/delete/${id}`),
    // Update user
    updateUserMsg: (params) => post(`user/updateUser`, params),
    updateUserPassword: (params) => post(`user/updatePassword/${params.get("id")}`, params),
    // Update user avatar
    uploadUrl: (userId) => `user/avatar/${userId}/${getBaseURL()}`,

    //SongList part
    // Get the full playlist
    getSongList: () => get("songList"),
    // Get the playlist type
    getSongListOfStyle: (style) => get(`songList/title/${style}`),
    // Returns a playlist with text in the title
    getSongListOfLikeTitle: (keywords) => get(`songList/title/${keywords}`),
    // Returns the song in the playlist with the specified playlist ID
    getListSongOfSongId: (songListId) => get(`sts/${songListId}`),

    // Singer part
    // Back to all Artists
    getAllSinger: () => get("singer"),
    // Classify singers by gender
    getSingerOfSex: (sex) => get(`singer/getBySex/${sex}`),

    // Collection part
    // Returns a list of favorites for the specified user ID
    getCollectionOfUser: (userId) => get(`collect/selectPlayList/${userId}`),
    // Add a song type to your collection: 0 represents the song and 1 represents the playlist
    setCollection: (params) => post(`collect`, params),

    deleteCollection: (userId, songId) => deletes(`collect/${userId}/${songId}`),

    isCollection: (params) => post(`collect/existSong`, params),

    // uts part
    // Submit score
    setRank: (params) => post(`uts/submitScore`, params),
    // Gets the rating for the specified playlist
    getRankOfSongListId: (songListId) => get(`uts/songList/${songListId}`),
    // Gets the playlist rating for the specified user
    getUserRank: (consumerId, songListId) => get(`uts/songList/${consumerId}/${songListId}`),

    // Comment part
    // Add a comment
    setComment: (params) => post(`comment`, params),
    // Delete a comment
    deleteComment: (id) => get(`comment/${id}`),
    // give a like.
    setSupport: (params) => post(`comment/Like/`, params),
    // Return to all comments
    getAllComment: (type, id) => {
        let url = "";
        if (type === 1) {
            url = `comment/getBySongListId/${id}`;
        } else if (type === 0) {
            url = `comment/getBySongId/${id}`;
        }
        return get(url);
    },

    // Song part
    // Returns the song with the specified song ID
    getSongOfId: (id) => get(`song/songId/${id}`),
    // Returns the song with the specified artist ID
    getSongOfSingerId: (id) => get(`song/singerId/${id}`),
    // Returns the song with the specified artist name
    getSongOfSingerName: (keywords) => get(`song/singerName/${keywords}`),
    // Download music
    downloadMusic: (url) => get(url, { responseType: "blob" }),
};

export { HttpManager };

