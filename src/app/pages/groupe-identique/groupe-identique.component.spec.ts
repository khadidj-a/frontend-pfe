import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeidentiqueComponent } from './groupeidentique.component';

describe('GroupeidentiqueComponent', () => {
  let component: GroupeidentiqueComponent;
  let fixture: ComponentFixture<GroupeidentiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupeidentiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupeidentiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
