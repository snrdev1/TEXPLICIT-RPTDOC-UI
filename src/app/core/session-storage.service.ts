import { Injectable,Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private _sessionStorage: Storage;
  private _selectedKnowledgeItems$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedKnowledgeItems$: Observable<any> = this._selectedKnowledgeItems$.asObservable();
  constructor() { 
    this._sessionStorage=sessionStorage;
  }

  get selectedTabIndex(): string {
    const data= this._sessionStorage.getItem('selectedTabIndex');

    if (data !== null)
      return data;
    else
      return '0';
  }

  @Input() set selectedTabIndex(value: string) {
    this._sessionStorage.setItem('selectedTabIndex', value);
  }

  get domains(): any {
    const data= this._sessionStorage.getItem('domains');

    if (data !== null)
      return JSON.parse(data);
    else
      return [];
  }

  @Input() set domains(value: any) {
    this._sessionStorage.setItem('domains', JSON.stringify(value));
  }

  observeSelectedKnowledgeItems(){
    const data = this._sessionStorage.getItem('selectedKnowledgeItems');
    // Emit User data
    if (data !== null)
      this._selectedKnowledgeItems$.next(JSON.parse(data));
    else
      this._selectedKnowledgeItems$.next([]);
  }

  setSelectedKnowledgeItems(data:any){
    // Set User data in localStorage
    const jsonData = JSON.stringify(data);
    this._sessionStorage.setItem('selectedKnowledgeItems', jsonData);

    this._selectedKnowledgeItems$.next(data);
  }
  
  getSelectedKnowledgeItems(){
    const data = this._sessionStorage.getItem('selectedKnowledgeItems');

    if (data !== null)
      return JSON.parse(data);
    else
      return [];
  }
}
