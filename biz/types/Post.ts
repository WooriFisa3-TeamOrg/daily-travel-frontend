interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface PostPreviewResponse {
    id: number;
    title: string;
    author: string;
    likeCount: number;
    imageFiles: string[];  // 이미지 파일 URL 리스트
    hashtags: string[];    // 해시태그 리스트
    creationDate: string;  // 포스트 생성 날짜
}

interface PostPagingResponse {
    page: number;  // 현재 페이지 번호
    end: boolean;  // 데이터 끝 여부
    postPreviewResponses: PostPreviewResponse[];  // 포스트 미리보기 응답 리스트
}