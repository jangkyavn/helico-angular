import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
    name: 'relativeTime',
    pure: false
})
export class RelativeTimePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        const result = moment(value).locale('vi').fromNow();
        return result;
    }
}
