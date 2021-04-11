import { HttpHeaders } from "@angular/common/http";
import { SessionConstant } from "../constants/session.constant";

export function getHeader() {
    return {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem(SessionConstant.TOKEN)}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
        })
    };
}