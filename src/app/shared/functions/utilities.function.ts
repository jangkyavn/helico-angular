import * as moment from 'moment';

export function makeSeoAlias(input: string) {
    if (input === undefined || input === '') {
        return '';
    }
    // Đổi chữ hoa thành chữ thường
    let slug = input.toLowerCase();

    // Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    // Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    // Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
}

export function getFormatedInputDate(input: any = null) {
    if (input) {
        return moment(input).format('YYYY-MM-DD');
    } else {
        return moment().format('YYYY-MM-DD');
    }
}

export function getFormatedViewDate(input: any = null) {
    if (input) {
        return moment(input).format('DD/MM/YYYY');
    } else {
        return moment().format('DD/MM/YYYY');
    }
}

export function getFormatedViewDateTime(input: any = null) {
    if (input) {
        return moment(input).format('DD/MM/YYYY HH:mm:ss');
    } else {
        return moment().format('DD/MM/YYYY HH:mm:ss');
    }
}

export function checkExtension(fileName: string, extentions: any) {
    return (new RegExp('(' + extentions.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

export function checkFileSize(fileSize: any) {
    if ((fileSize / 1024 / 1024) < 2048) { return true; }
    return false;
}
