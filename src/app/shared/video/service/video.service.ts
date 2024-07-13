import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelPredict } from '../../models/data-model.interface';

@Injectable({providedIn: 'root'})

export class videoService {
    private apiUrl = 'http://localhost:8000/predict/';
    constructor(private http: HttpClient) {}
    
    getPredict(image: Blob): Observable<DataModelPredict>{
        const formData = new FormData();
        formData.append('file', image);
        return this.http.post<any>(this.apiUrl, formData);
    }
}