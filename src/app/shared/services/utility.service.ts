import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    getFormatedInputDate(input: any = null) {
        if (input) {
            return moment(input).format('YYYY-MM-DD');
        } else {
            return moment().format('YYYY-MM-DD');
        }
    }

    getFormatedViewDate(input: any = null) {
        if (input) {
            return moment(input).format('DD/MM/YYYY');
        } else {
            return moment().format('DD/MM/YYYY');
        }
    }

    getFormatedViewDateTime(input: any = null) {
        if (input) {
            return moment(input).format('DD/MM/YYYY HH:mm:ss');
        } else {
            return moment().format('DD/MM/YYYY HH:mm:ss');
        }
    }

    checkExtension(fileName: string, extentions: any) {
        return (new RegExp('(' + extentions.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }

    checkFileSize(fileSize: any) {
        if ((fileSize / 1024 / 1024) < 2048) { return true; }
        return false;
    }
}
