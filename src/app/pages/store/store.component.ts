import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../shared/model/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-store',
  imports: [CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  categories = ['Rings', 'Bracelets', 'Necklaces', 'Earrings'];
  selectedCategory = '';

  products: Products[] = [
    {
      id: 1,
      name: 'Golden Ring',
      price: 120,
      category: 'Rings',
      image: 'assets/products/ring1.jpg',
    },
    {
      id: 2,
      name: 'Elegant Bracelet',
      price: 90,
      category: 'Bracelets',
      image: 'assets/products/bracelet1.jpg',
    },
    {
      id: 3,
      name: 'Pearl Necklace',
      price: 150,
      category: 'Necklaces',
      image: 'assets/products/necklace1.jpg',
    },
    {
      id: 4,
      name: 'Diamond Earrings',
      price: 200,
      category: 'Earrings',
      image: 'assets/products/earrings1.jpg',
    },
  ];

  filteredProducts: Products[] = [];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('category');
      this.selectedCategory = slug ? this.capitalize(slug) : '';
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
}
