import { Controller } from "stimulus"
import {
    SUBMIT_BUTTON_TEXT,
    SUBMIT_BUTTON_TEXT_ON_REQUEST,
    SAVE_LISTING_BUTTON_TEXT,
    SAVE_LISTING_BUTTON_TEXT_ON_REQUEST
} from "./constants"

export default class extends Controller {
    static targets = [
        "submitBtn",
        "saveBtn",
        "url",
        "urlValidFeedback",
        "urlInvalidFeedback",
        "listingItem",
        "saveListingFeedback",
        "listingId",
        "city",
        "name",
        "market"
    ];

    get url() {
        return this.urlTarget.value;
    }

    connect() {
        this.enableSubmitButton();
    }

    displayUrlError(error) {
        this.urlTarget.classList.add("is-invalid");
        this.urlInvalidFeedbackTarget.innerHTML = error;
    }

    displayUrlSuccess(error) {
        this.urlTarget.classList.add("is-valid");
        this.urlValidFeedbackTarget.innerHTML = error;
    }

    cleanUpListingModal() {
        this.listingItemTarget.classList.remove("is-invalid");
        this.saveListingFeedbackTarget.innerHTML = "";
    }

    displaySaveListingError(error) {
        this.listingItemTarget.classList.add("is-invalid");
        this.saveListingFeedbackTarget.innerHTML = error;
    }

    enableSubmitButton() {
        this.submitBtnTarget.innerHTML = SUBMIT_BUTTON_TEXT;
        this.submitBtnTarget.disabled = false;
    }

    disableSubmitButton() {
        this.submitBtnTarget.innerHTML = SUBMIT_BUTTON_TEXT_ON_REQUEST;
        this.submitBtnTarget.disabled = true;
    }

    enableSaveButton() {
        this.saveBtnTarget.innerHTML = SAVE_LISTING_BUTTON_TEXT;
        this.saveBtnTarget.disabled = false;
    }

    disableSaveButton() {
        this.saveBtnTarget.innerHTML = SAVE_LISTING_BUTTON_TEXT_ON_REQUEST;
        this.saveBtnTarget.disabled = true;
    }

    get listingId() {
        return this.data.get("listingId")
    }

    set listingId(value) {
        this.data.set("listingId", value)
    }

    get city() {
        return this.data.get("city")
    }

    set city(value) {
        this.data.set("city", value)
    }

    get name() {
        return this.data.get("name")
    }

    set name(value) {
        this.data.set("name", value)
    }

    get market() {
        return this.data.get("market")
    }

    set market(value) {
        this.data.set("market", value)
    }

    get listing() {
        return {
            listing_id: this.listingId,
            city: this.city,
            name: this.name,
            markets: [this.market]
        }
    }

    handleErrors(response) {
        const { status } = response;
        if (status >= 200 && status < 300) {
            return response;
        } else  if (status === 404) {
            throw new Error("Not Found");
        } else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    }

    fetchListing(e) {
        e.preventDefault();
        this.disableSubmitButton();
        this.cleanUpListingModal();
        fetch(`/listing/fetch?url=${this.url}`)
            .then(response => this.handleErrors(response))
            .then(response => response.json())
            .then(({listing: {id, city, name, market}}) => {
                this.listingId = id;
                this.city = city;
                this.name = name;
                this.market = market;

                this.listingIdTarget.innerHTML = id;
                this.cityTarget.innerHTML = city;
                this.nameTarget.innerHTML = name;
                this.marketTarget.innerHTML = market;

                this.enableSubmitButton();
                this.enableSaveButton();

                $(".modal").modal("show");
            }).catch((e) => {
            this.displayUrlError(e.message);
            this.enableSubmitButton();
        });
    }

    submitListing(e) {
        e.preventDefault();
        this.disableSaveButton();
        fetch("/listing", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    "X-CSRF-Token": this.getMetaValue("csrf-token")
                },
                body: JSON.stringify({
                    listing: {
                        listing_id: this.listingId,
                        city: this.city,
                        title: this.name,
                        markets: [{
                            name: this.market
                        }]
                    }
                })
            }
        ).then(response => this.handleErrors(response))
            .then(() => {
                this.displayUrlSuccess(`Listing ${this.listingId} has been added`);
                $(".modal").modal("hide");
            }).catch((e) => {
                this.displaySaveListingError(e.message);
                this.enableSaveButton();
        });
    }

    getMetaValue(name) {
        const element = document.head.querySelector(`meta[name="${name}"]`);
        return element.getAttribute("content")
    }
}
