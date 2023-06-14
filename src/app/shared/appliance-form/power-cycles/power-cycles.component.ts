import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { PowerConsumptionCycle } from 'src/app/np-data/lib/power-appliance.interface';
import { MinutesToHoursPipe } from '../../minutes-to-hours.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe, DecimalPipe } from '@angular/common';
import { NullToZeroDirective } from '../../null-to-zero.directive';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

type PowerCycleForm = FormGroup<{
  [key in keyof PowerConsumptionCycle]: FormControl<PowerConsumptionCycle[key]>
}>;

const DEFAULT_VALUE: PowerConsumptionCycle = {
  length: 0,
  consumption: 0,
};


@Component({
  selector: 'laiks-power-cycles',
  templateUrl: './power-cycles.component.html',
  styleUrls: ['./power-cycles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: PowerCyclesComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: PowerCyclesComponent, multi: true },
  ],
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatInputModule, FormsModule, NullToZeroDirective, ReactiveFormsModule, NgIf, MatButtonModule, MatMenuModule, AsyncPipe, DecimalPipe, MinutesToHoursPipe]
})
export class PowerCyclesComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @ViewChild(MatTable) private table?: MatTable<PowerCycleForm>;

  powerCycles = new FormArray<PowerCycleForm>([]);

  displayedColumns = ['index', 'length', 'consumption', 'actions'];

  isLarge$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(
      map(state => !state.matches),
      shareReplay(1),
    );

  private touchFn = () => { };

  private subscription: Subscription | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  writeValue(obj: PowerCyclesComponent): void {
    if (!Array.isArray(obj)) {
      return;
    }
    this.setCycles(obj.map(val => ({ ...val, length: val.length / 1000 / 60 })));
    this.table?.renderRows();
  }

  registerOnChange(fn: any): void {
    this.subscription = this.powerCycles.valueChanges.pipe(
      map(cycles => cycles.map(cycle => ({ ...cycle, length: (cycle.length || 0) * 1000 * 60 }))),
    ).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.powerCycles.disable();
    } else {
      this.powerCycles.enable();
    }
  }

  validate(): ValidationErrors | null {
    if (this.powerCycles.valid) {
      return null;
    }

    const errors = this.powerCycles
      .controls
      .filter(control => !control.valid);
    return { invalidControls: errors };
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onAddCycle(idx: number, value: PowerConsumptionCycle = DEFAULT_VALUE) {
    this.powerCycles.insert(idx, this.createGroup(value));
    this.table?.renderRows();
  }

  onDeleteCycle(idx: number) {
    this.powerCycles.removeAt(idx);
    this.table?.renderRows();
  }

  getTotalConsumption(cycles: Partial<PowerConsumptionCycle>[]): number { // kWh
    return cycles
      .map(cycle => (cycle.length || 0) * (cycle.consumption || 0))
      .map(cons => cons / 60 / 1000)
      .reduce((acc, curr) => acc + curr, 0);
  }

  getTotalLength(cycles: Partial<PowerConsumptionCycle>[]): number {
    return cycles.reduce((acc, curr) => acc + (curr.length || 0), 0);
  }

  private setCycles(cycles: PowerConsumptionCycle[]): void {
    this.powerCycles.clear({ emitEvent: false });
    for (const cycle of cycles) {
      this.powerCycles.push(this.createGroup(cycle), { emitEvent: false });
    }
  }

  private createGroup(value: PowerConsumptionCycle): PowerCycleForm {
    return new FormGroup({
      length: new FormControl(value.length || 0, {
        validators: [Validators.min(0), Validators.required],
        nonNullable: true,
      }),
      consumption: new FormControl(value.consumption || 0, {
        validators: [Validators.min(0), Validators.required],
        nonNullable: true,
      })
    });
  }

}
