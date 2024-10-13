import { Pageable, Sort } from "./Page";

export interface PostResponse {
    id: number;
    title: string;
    content: string;
    nickname: string;
    profileImagePath: string;
    placeName: string;
    likesCount: number;
    images: string[];
    creationDate: string; // 'yyyy-MM-dd HH:mm:ss' 형식의 문자열로 가정
    hashtags: string[];
    comments: CommentResponse[];
    mine: boolean;
}
export interface CommentResponse {
    id: number; // 댓글 ID
    content: string; // 댓글 내용
    createdAt: string; // 'yyyy-MM-dd HH:mm:ss' 형식의 문자열로 가정
    updatedAt: string; // 'yyyy-MM-dd HH:mm:ss' 형식의 문자열로 가정
    uuid: string; // 댓글 작성자 ID
    nickname: string; // 댓글 작성자 닉네임
    profileImagePath: string; // 댓글 작성자 프로필 이미지 경로
}

// interface PostPreviewResponse {
//     id: number;
//     title: string;
//     author: string;
//     likeCount: number;
//     imageFiles: string[];  // 이미지 파일 URL 리스트
//     hashtags: string[];    // 해시태그 리스트
//     creationDate: string;  // 포스트 생성 날짜
// }

// interface PostPagingResponse {
//     page: number; // 현재 페이지 번호
//     end: boolean; // 데이터 끝 여부
//     postPreviewResponses: PostPreviewResponse[]; // 포스트 미리보기 응답 리스트
// }

export interface PostPreviewResponse {
    id: number;
    title: string;
    nickname: string;
    profileImagePath: string;
    content: string;
    plcaeName: string;
    likeCount: number;
    thumbnail: string;
    hashtags: string[];
    creationDate: string; // "yyyy-MM-dd HH:mm:ss" 형식의 문자열
}

export interface PaginatedPostPreviewResponse {
    content: PostPreviewResponse[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}
