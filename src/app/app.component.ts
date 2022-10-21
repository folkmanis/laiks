import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { addHours } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  currentTime = new Date();

  ngOnInit(): void {

  }

}
