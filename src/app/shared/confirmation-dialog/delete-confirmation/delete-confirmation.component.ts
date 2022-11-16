import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'laiks-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
