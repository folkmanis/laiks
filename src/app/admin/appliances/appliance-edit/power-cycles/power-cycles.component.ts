import { ViewChild, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PowerConsumptionCycle } from 'src/app/np-data/lib/power-appliance.interface';
import { MatTable } from '@angular/material/table';
import { map, merge, Observable, of, share, Subscription, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  ]
})
export class PowerCyclesComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @ViewChild(MatTable) private table?: MatTable<PowerCycleForm>;

  powerCycles = new FormArray<PowerCycleForm>([]);

  displayedColumns = ['index', 'length', 'consumption', 'actions'];

  private touchFn = () => { };

  private subscription: Subscription | undefined;

  isLarge$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(
      map(state => !state.matches),
      shareReplay(1),
    );

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

  getTotals(cycles: Partial<PowerConsumptionCycle>[]): PowerConsumptionCycle {
    return cycles.map(cycle => ({ length: cycle.length || 0, consumption: cycle.consumption || 0 }))
      .reduce(
        (acc, curr) => ({
          length: acc.length + curr.length,
          consumption: acc.consumption + curr.consumption * curr.length / 60,
        }),
        { length: 0, consumption: 0 }
      );
  }

}
