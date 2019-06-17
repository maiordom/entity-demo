export const download = (
    filename: string,
    text: string,
    fileType: string
) => {
    const element = document.createElement('a');

    element.setAttribute('href', `data:${fileType};charset=utf-8,` + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};
