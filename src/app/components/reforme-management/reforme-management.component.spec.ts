import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReformeManagementComponent } from './reforme-management.component';

describe('ReformeManagementComponent', () => {
  let component: ReformeManagementComponent;
  let fixture: ComponentFixture<ReformeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReformeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReformeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
