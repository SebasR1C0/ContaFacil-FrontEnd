import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarbonodetalleComponent } from './listarbonodetalle.component';

describe('ListarbonodetalleComponent', () => {
  let component: ListarbonodetalleComponent;
  let fixture: ComponentFixture<ListarbonodetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarbonodetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarbonodetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
