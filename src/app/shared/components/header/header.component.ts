import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { I18nService } from '../../../service/i18n/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem, Products } from '../../model/product';
import { FavoritesService } from '../../../service/favorites.service';
import { CartService } from '../../../service/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit {
  i18nService = inject(I18nService);
  CartService = inject(CartService);
  language: 'en' | 'ar' = 'en';
  isArabic = false;
  cartItems$ = this.CartService.cartItems$;

  switchToArabic() {
    this.language = 'ar';
    this.isArabic = true;
    this.i18nService.loadTranslations(this.language);
  }

  switchToEnglish() {
    this.language = 'en';
    this.isArabic = false;
    this.i18nService.loadTranslations(this.language);
  }
  //ممكن احتاجها لما اعدل موضوع انه اللغة تضلها محفوظة حتى لو سكلات الويب سايت
  // ngOnInit() {
  //   this.language = (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  //   this.isArabic = this.language === 'ar';
  // }
  public favoriteService = inject(FavoritesService);

  openProductModal(product: Products) {
    this.favoriteService.openModal(product);
  }
  favoriteProducts: Products[] = [];

  ngOnInit() {
    this.favoriteService.favorites$.subscribe((products) => {
      this.favoriteProducts = products;
    });
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }
  cartItems: CartItem[] = [];
  @Output() closeDrawer = new EventEmitter<void>();
  private cartService = inject(CartService);
  private router = inject(Router);

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  getTotal(): number {
    return this.cartService
      .getCurrentItems()
      .reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  goToCart() {
    this.closeDrawer.emit();
    this.router.navigate(['/cart']);
  }

  gotostore() {
    this.router.navigate(['/store']);
  }
  ngAfterViewInit() {
    const offcanvasEl = document.getElementById('offcanvasRight');
    if (!offcanvasEl) return;

    // عند فتح الدراور
    offcanvasEl.addEventListener('show.bs.offcanvas', () => {
      document.body.classList.add('no-scroll');
    });

    // عند غلق الدراور
    offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
      document.body.classList.remove('no-scroll');
    });
  }
  cartCount$: Observable<number> = this.cartService.cartCount$;
}
