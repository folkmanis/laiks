import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'laiks-cancel-edit-confirmation',
  templateUrl: './cancel-edit-confirmation.component.html',
  styleUrls: ['./cancel-edit-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelEditConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
