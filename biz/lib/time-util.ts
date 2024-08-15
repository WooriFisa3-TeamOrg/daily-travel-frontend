function parseDate(dateStr: string): Date {
    // 입력 문자열에서 년, 월, 일, 시, 분, 초를 추출
    const [datePart, timePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    // JavaScript의 Date 객체는 월을 0부터 시작하므로 1을 빼줍니다.
    return new Date(year, month - 1, day, hour, minute, second);
}

export const timeAgo = (dateStr: string): string => {
    // 문자열을 Date 객체로 변환
    const inputDate = parseDate(dateStr);

    // 현재 시간
    const now = new Date();

    // 시간 차이 계산 (밀리초 단위)
    const timeDifference = now.getTime() - inputDate.getTime();

    // 밀리초를 분으로 변환
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

    // 시간 차이를 문자열로 반환
    if (minutesAgo < 1) {
        return "방금 전";
    } else if (minutesAgo < 60) {
        return `${minutesAgo}분 전`;
    } else if (hoursAgo === 1) {
        return "1시간 전";
    } else {
        return `${hoursAgo}시간 전`;
    }
};
