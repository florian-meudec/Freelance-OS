import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenu } from './select-menu';

describe('SelectMenu', () => {
  let component: SelectMenu;
  let fixture: ComponentFixture<SelectMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
