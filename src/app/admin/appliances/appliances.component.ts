import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'laiks-appliances',
  templateUrl: './appliances.component.html',
  styleUrls: ['./appliances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppliancesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
