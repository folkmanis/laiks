import { CdkOverlayOrigin, ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Injector, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';


interface HourDetailsData {
  offset: number;
}

@Directive({
  selector: 'button[laiksHourDetails]',
  exportAs: 'hourDetails',
})
export class HourDetailsDirective extends CdkOverlayOrigin implements OnInit, OnDestroy {

  @Input('laiksHourDetails') template?: TemplateRef<HourDetailsData>;

  @Input('laiksHourDetailsOffset') offset?: number;

  get expanded(): boolean {
    return !!this.overlayRef?.hasAttached();
  }

  private overlayRef?: OverlayRef;

  private subscription?: Subscription;

  private readonly connectedPositions: ConnectedPosition[] = [
    {
      offsetX: 0,
      offsetY: -10,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }
  ];

  private config!: OverlayConfig;

  constructor(
    private overlay: Overlay,
    elementRef: ElementRef,
    private viewCpntainerRef: ViewContainerRef,
  ) {
    super(elementRef);
  }

  @HostListener('click')
  open() {
    this.expanded ? this.closeOverlay() : this.openOverlay();
  }


  ngOnInit() {
    this.config = this.overlayConfig();
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }

  private openOverlay() {
    if (!this.template || typeof this.offset !== 'number') {
      return;
    }
    this.overlayRef = this.overlay.create(this.config);
    const injector = Injector.create({
      providers: [{ provide: OverlayRef, useValue: this.overlayRef }]
    });
    console.log(this.offset);
    const portal = new TemplatePortal(this.template, this.viewCpntainerRef, { offset: this.offset }, injector);
    this.overlayRef.attach(portal);
    this.subscription = this.overlayRef.backdropClick()
      .subscribe(event => {
        event.stopPropagation();
        event.preventDefault();
        this.closeOverlay();
      });
  }

  private closeOverlay() {
    this.subscription && this.subscription.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private overlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.connectedPositions)
        .withGrowAfterOpen()
        .withLockedPosition(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      minWidth: '180px',
      maxWidth: '360px',
      hasBackdrop: true,
      backdropClass: ['cdk-overlay-transparent-backdrop'],
      panelClass: ['mat-elevation-z8', 'laiks-hour-details'],
    });
  }


}
