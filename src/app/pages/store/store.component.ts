import { FavoritesService } from './../../service/favorites.service';
import { Component, inject, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../shared/model/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccesoreisService } from '../../service/accesoreis.service';

@Component({
  selector: 'app-store',
  imports: [CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  categories = ['Rings', 'Bracelets', 'Necklaces', 'Earrings'];
  selectedCategory = '';
  @Input() product: Products | undefined;

  products: Products[] = [];

  filteredProducts: Products[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AccesoreisService);
  private favoriteService = inject(FavoritesService);
  favoriteStatus = false;
  ngOnInit(): void {
    const favorites = this.favoriteService.getFavorites();
    this.favoriteStatus = !!favorites?.some((p) => p.id === this.product?.id);
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('category');
      this.selectedCategory = slug ? this.capitalize(slug) : '';
      this.filterProducts();
    });
    this.productService.getAccesoreis().subscribe((data) => {
      this.products = data;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    if (!this.selectedCategory) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (p) => p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
  }

  goToProduct(product: Products) {
    alert(`You clicked on: ${product.name}`);
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  addToFavorites() {
    alert('Added to favorites');
  }
  addToCart() {
    alert('Added to cart');
  }
  toggleFavorite(product: Products) {
    if (this.isFavorite(product)) {
      this.favoriteService.removeFromFavorites(product.id);
    } else {
      this.favoriteService.addToFavorites(product);
    }
  }
  isFavorite(product: Products): boolean {
    return this.favoriteService.getFavorites().some((p) => p.id === product.id);
  }
}
