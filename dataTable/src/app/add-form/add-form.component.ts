import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {

  public target: string;
  safeTarget: SafeResourceUrl;

  constructor(private routeInfo: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.routeInfo.params.subscribe((params: Params) => this.target = params['target']);
        this.safeTarget = this.sanitizer.bypassSecurityTrustResourceUrl(this.target);  // 防止 NG4 识别xxs攻击， 转换链接为安全资源
      });
  }

  ngOnInit() {
  }

}
