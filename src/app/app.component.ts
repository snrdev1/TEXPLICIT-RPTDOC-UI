import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { SeoService } from './shared/services/seo.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Texplicit2';

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private seoService: SeoService,
    private http: HttpClient) {}
  
  // ngOnInit(): void {
  //   this.router.events.pipe(
  //     filter(e => e instanceof NavigationEnd),
  //     map(e => this.activatedRoute),
  //     map((route) => {
  //       while (route.firstChild) route = route.firstChild;
  //       return route;
  //     }),
  //     filter((route) => route.outlet === 'primary'),
  //     mergeMap((route) => route.data),
  //   ).subscribe(data => {
  //     if(data['seo']!==undefined){
  //       let seoData = data['seo'];
  //       this.seoService.updateTitle(seoData['title']);
  //       this.seoService.updateMetaTags(seoData['metaTags']);
  //     }
  //   });

  // }

  // ngAfterViewInit(){
  //   let that=this;
  //   let xhttp=new XMLHttpRequest();
  //   xhttp.onreadystatechange = function() {
  //     if (this.readyState == 4 && this.status == 200) {
  //         that.updatesitemap(this);
  //     }
  //   };
  //   xhttp.open("GET", "/assets/sitemap.xml", true);
  //   xhttp.send();
  // } 

  // updatesitemap(xml:XMLHttpRequest){
  //   let hasUrl=false;
  //   let xmlDoc =xml.responseXML;
  //   var urls=xmlDoc?.getElementsByTagName("url");
  //   if (urls!==undefined){
  //     for (var i = 0; i <urls.length; i++) {
  //       if (urls[i].nodeType == 1) {
  //         let location=urls[i].getElementsByTagName("loc");
  //         if(location[0].innerHTML==window.location.href)
  //         {
  //           hasUrl=true;
  //         }
  //       }
  //     }
  //   }
    
  //   if (!hasUrl){
  //     var urlElement=xmlDoc?.createElement('url');
  //     var locElement=xmlDoc?.createElement('loc');
  //     var lastmodElement=xmlDoc?.createElement('lastmod');
  //     var priorityElement=xmlDoc?.createElement('priority');
  //     if(locElement!==undefined) {
  //       locElement.innerHTML=window.location.href;
  //       urlElement?.appendChild(locElement);
  //     }
  //     if(lastmodElement!==undefined) {
  //       lastmodElement.innerHTML=new Date().toDateString();
  //       urlElement?.appendChild(lastmodElement);
  //     }
  //     if(priorityElement!==undefined) {
  //       priorityElement.innerHTML="0.80";
  //       urlElement?.appendChild(priorityElement);
  //     }
  //     if(urlElement!==undefined) {
  //         xmlDoc?.getElementsByTagName('urlset')[0].appendChild(urlElement);
  //         let content=xmlDoc?.getElementsByTagName("urlset")[0].outerHTML;
  //         content=content+'';
  //         let file = new Blob([content], { type: 'text/xml;charset=utf-8' });
  //         //fs.
  //         //FileSaver.saveAs(file, "/assets/sm.xml");
  //         console.log('finish...');
  //       }
  //     }
  // }
}

