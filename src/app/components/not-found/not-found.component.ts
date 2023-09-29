import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit{
  errorCode: string = '404'
  errorMessage: string = 'Page not found'
  routeParams: any
  constructor(private router: Router, private route: ActivatedRoute) {
    this.routeParams = this.router.getCurrentNavigation()
  }

  ngOnInit() {
    console.log(this.routeParams)
    console.log(history.state)
    this.route.params.subscribe(paramsData => {
      console.log(paramsData)
    })
    console.log(this.route.snapshot.queryParamMap)
    console.log(this.route.queryParams)
    console.log(this.router.getCurrentNavigation()!.extras.state)
    // this.errorCode = this.route.snapshot.queryParamMap.get('type') || '404'
    // this.errorCode = this.route.snapshot.queryParamMap.get('message') || '404'
  }
}
