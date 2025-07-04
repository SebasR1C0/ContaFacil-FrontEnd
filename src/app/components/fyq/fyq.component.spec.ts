import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FyqComponent } from './fyq.component';

describe('FyqComponent', () => {
  let component: FyqComponent;
  let fixture: ComponentFixture<FyqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FyqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FyqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
