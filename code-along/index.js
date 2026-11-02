/* Question and Answer Accordions */

const qaItems = [
    {
        question: "How do I track my package?",
        answer: "You can easily track your package using our online tracking system. Simply enter your tracking number on our website to get real-time updates on your delivery's status.",
    },
    {
        question: "What should I do if my package is damaged or lost?",
        answer: "If your package arrives damaged or is lost in transit, please contact us immediately. We will investigate the matter and arrange for a replacement or refund as per our policy.",
    },
    {
        question: "Can I change my delivery address after placing an order?",
        answer: "Yes, you can change your delivery address as long as the package has not been dispatched. Please contact our customer service team as soon as possible to make any changes.",
    },
    {
        question: "Are there any items that cannot be shipped?",
        answer: "Yes, there are certain restrictions on items that can be shipped due to safety and legal reasons. Please refer to our shipping policy or contact us for more information on prohibited items.",
    },
];

const accordionDiv = document.getElementById("accordion");

qaItems.forEach((qaItem) => {
    const questionText = qaItem.question;
    const answerText = qaItem.answer;
    // const { questionText: question, answerText: answer } = qaItem;

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("accordion-question");
    questionDiv.textContent = questionText;

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("accordion-answer");
    answerDiv.textContent = answerText;

    questionDiv.appendChild(answerDiv);
    accordionDiv.appendChild(questionDiv);

    questionDiv.addEventListener("click", () => {
        questionDiv.classList.toggle("active");
        answerDiv.classList.toggle("active");
    });
});

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storage Blueprints
    ~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class DatabaseObject {
    toString() {
        throw new Error("Not Implemented");
    }
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storing Products
    ~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class Product extends DatabaseObject {
    constructor(name, inventory) {
        super();
        this.name = name;
        this.inventory = inventory;
    }

    toString() {
        return `${this.name} ${this.inventory} left in stock`;
    }
}

class ProductDAO {
    static seeds = [
        {
            name: "Apples",
            inventory: 100,
        },
        {
            name: "Bananas",
            inventory: 90,
        },
        {
            name: "Peaches",
            inventory: 70,
        },
    ];

    getAll() {
        throw new Error("Not Implemented");
    }

    getProductByName(name) {
        const products = this.getAll();
        return products.find((product) => product.name == name);
    }

    update(product) {
        throw new Error("Not Implemented");
    }
}

/* Product Session Storage */

class SessionStorageProductDAO extends ProductDAO {
    constructor() {
        super();
        this.database = sessionStorage;
    }

    getAll() {
        const productsAsJSON = this.database.getItem("products");
        const productsData = productsAsJSON
            ? JSON.parse(productsAsJSON)
            : ProductDAO.seeds;

        return productsData.map((productData) => {
            const { name, inventory } = productData;
            return new Product(name, inventory);
        });
    }

    update(product) {
        const existingProducts = this.getAll();
        const indexToDelete = existingProducts.findIndex(
            (productInList) => productInList.name == product.name,
        );

        existingProducts.splice(indexToDelete, 1, product);
        this.database.setItem("products", JSON.stringify(existingProducts));
    }
}

/* Product Cookie Storage */

class CookieStorageProductDAO extends ProductDAO {
    constructor() {
        super();
    }

    getAll() {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("products="))
            ?.split("=")[1];

        const productsData = cookieValue
            ? JSON.parse(cookieValue)
            : ProductDAO.seeds;

        return productsData.map(
            (productData) =>
                new Product(productData.name, productData.inventory),
        );
    }

    update(product) {
        const existingProducts = this.getAll();
        const indexToDelete = existingProducts.findIndex(
            (productInList) => productInList.name == product.name,
        );

        existingProducts.splice(indexToDelete, 1, product);
        document.cookie = `products=${JSON.stringify(existingProducts)};`;
    }
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storing Deliveries
    ~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class Delivery extends DatabaseObject {
    constructor(params) {
        super();
        const { address, scheduledTime, product, quantity } = params;

        this.address = address;
        this.scheduledTime = scheduledTime;
        this.product = product;
        this.quantity = quantity;
    }

    toString() {
        return `Delivering ${this.quantity} of ${this.product.name} to ${this.address} at ${this.scheduledTime}`;
    }

    static create(params) {
        return new Delivery(params);
    }
}

class DeliveryDAO {
    getAll() {
        throw new Error("Not Implemented");
    }

    create(delivery) {
        throw new Error("Not Implemented");
    }
}

/* Delivery Session Storage */

class SessionStorageDeliveryDAO extends DeliveryDAO {
    constructor() {
        super();
        this.database = sessionStorage;
    }

    getAll() {
        const deliveriesAsJSON = this.database.getItem("deliveries");
        const deliveriesData = deliveriesAsJSON
            ? JSON.parse(deliveriesAsJSON)
            : [];

        return deliveriesData.map((deliveryData) => {
            return Delivery.create(deliveryData);
        });
    }

    create(delivery) {
        const existingDeliveries = this.getAll();
        existingDeliveries.push(delivery);
        this.database.setItem("deliveries", JSON.stringify(existingDeliveries));
    }
}

/* Delivery Cookie Storage */

class CookieStorageDeliveryDAO extends DeliveryDAO {
    constructor() {
        super();
    }

    getAll() {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("deliveries="))
            ?.split("=")[1];

        const deliveriesData = cookieValue ? JSON.parse(cookieValue) : [];

        return deliveriesData.map((deliveryData) => {
            return Delivery.create(deliveryData);
        });
    }

    create(delivery) {
        const existingDeliveries = this.getAll();
        existingDeliveries.push(delivery);
        document.cookie = `deliveries=${JSON.stringify(existingDeliveries)};`;
    }
}

/* Create Deliveries */

class CreateDeliveryService {
    constructor(productDao, deliveryDao) {
        this.productDao = productDao;
        this.deliveryDao = deliveryDao;
    }

    createDelivery(productName, quantity, address, scheduledTime) {
        const product = this.productDao.getProductByName(productName);
        const newInventory = product.inventory - quantity;
        product.inventory = newInventory;
        const deliveryData = {
            product,
            quantity,
            address,
            scheduledTime,
        };

        this.deliveryDao.create(deliveryData);
        this.productDao.update(product);
    }
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Initialize Products and Populate Deliveries
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

// const productDao = new SessionStorageProductDAO();
// const deliveryDao = new SessionStorageDeliveryDAO();

const productDao = new CookieStorageProductDAO();
const deliveryDao = new CookieStorageDeliveryDAO();

const createDeliveryService = new CreateDeliveryService(
    productDao,
    deliveryDao,
);

const deliveryList = document.getElementById("deliveries-list");
const deliveries = deliveryDao.getAll();

for (let i = 0; i < deliveries.length; i++) {
    const delivery = deliveries[i];
    const deliveryLi = document.createElement("li");

    deliveryLi.textContent = delivery.toString();
    deliveryList.appendChild(deliveryLi);
}

/* Populate Options */

const productNameSelect = document.getElementById("productName");
const products = productDao.getAll();
const quantityInput = document.getElementById("quantity");

for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const option = document.createElement("option");
    option.innerText = product.toString();
    option.setAttribute("value", product.name);

    const existingInventory = product.inventory;

    if (i == 0) {
        quantityInput.setAttribute("max", existingInventory);
        quantityInput.setAttribute("min", 1);
    }

    if (existingInventory > 0) {
        productNameSelect.appendChild(option);
    }
}

/* Change Max Quantity when Dropdown Selection Changes */

function handleChangeToProductName(event) {
    const productName = event.target.value;
    const selectedProduct = productDao.getProductByName(productName);
    const existingInventory = selectedProduct.inventory;

    quantityInput.setAttribute("max", existingInventory);
    quantityInput.setAttribute("min", 1);
}

productNameSelect.addEventListener("change", handleChangeToProductName);

/* Capture Delivery Form Data */

const createDeliveryForm = document.querySelector("#section-deliveries form");

createDeliveryForm.addEventListener("submit", (event) => {
    // event.preventDefault();
    const formData = new FormData(event.target);
    const valueAddress = formData.get("address");
    const valueScheduledTime = formData.get("scheduledTime");
    const valueProductName = formData.get("productName");
    const valueQuantity = formData.get("quantity");

    createDeliveryService.createDelivery(
        valueProductName,
        valueQuantity,
        valueAddress,
        valueScheduledTime,
    );
});
