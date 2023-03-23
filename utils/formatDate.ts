const formatDate = (date: string): string => {
    const currentDate = new Date().getTime();
    const diff = Math.floor((currentDate - new Date(date).getTime()) / 60000);
    const hoursDiff = Math.floor(diff / 60);
    if (diff < 1) {
        return `Przed chwilą`;
    } else if (diff === 1) {
        return `${diff} minutę temu`;
    } else if (diff < 60) {
        return `${diff} minut temu`;
    } else if (hoursDiff < 5 || (hoursDiff >= 22 && hoursDiff <= 24)) {
        return `${hoursDiff} godziny temu`;
    } else if (hoursDiff >= 5 && hoursDiff < 22) {
        return `${Math.floor(diff / 60)} godzin temu`;
    } else {
        return new Date(date).toLocaleDateString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
};
export default formatDate;
