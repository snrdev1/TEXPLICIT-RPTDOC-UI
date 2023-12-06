import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  updateTitle(title: string){
    this.title.setTitle(title);
  }

  updateMetaTags(metaTags: MetaDefinition[]){
    metaTags.forEach(m=> {
      console.log(m.property,m.content);
      this.meta.updateTag(m);
    });
  }
}
