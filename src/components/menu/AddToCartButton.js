import FlyingButton from 'react-flying-item'

export default function AddToCartButton({ image, basePrice, hasOptions, onAddToCart }) {

    if (!hasOptions) {
        return (
            <div className='flying-button-parent mt-4'>
                <FlyingButton src={image} targetTop={'5%'} targetLeft={'95%'}>
                    <div onClick={onAddToCart}>
                        Add to cart ${basePrice}
                    </div>
                </FlyingButton>
            </div>
        )
    }

    return (
        <button type="button" onClick={onAddToCart}
            className="mt-4 bg-primary rounded-full text-white px-8 py-2">
            <span>Add to cart ${basePrice} onwards</span>
        </button>
    )
}