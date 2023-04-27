class UserDB {
    declare _id: string;
    declare username: string;
    declare avatarUrl: string;

    constructor(_id: string, username: string, avatarUrl: string) {
        this._id = _id;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }
}
export default UserDB;
