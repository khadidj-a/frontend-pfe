import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaffectationManagementComponent } from './reaffectation-management.component';

describe('ReaffectationManagementComponent', () => {
  let component: ReaffectationManagementComponent;
  let fixture: ComponentFixture<ReaffectationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaffectationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReaffectationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
