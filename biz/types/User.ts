export interface UserGetResponse {
    email: string;
    nickname: string;
    profileImagePath: string;
    createdAt: string; // ISO 8601 형식의 문자열
    updatedAt: string; // ISO 8601 형식의 문자열
    isDeleted: boolean;
}
