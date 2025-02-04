import React, { useEffect, useState } from 'react'
import { fetchClothes } from '../api/clothes';
import CardComponent from '../components/CardComponent';
import { CardItem } from '../models/CardItem';
import { Clothes } from '../models/Clothes';

const ListProductForm = () => {
    const [clothes, setClothes] = useState<Clothes[]>([]);
    const fetchData = async () => {
        const data = await fetchClothes();
        console.log(data)
        setClothes(data['clothes']);
    }
    useEffect(() => {
        fetchData();
    }, []);
    function HandleClickCard(card: CardItem | undefined): void {
        console.log(card)
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

            {clothes?.map((cloth: Clothes, key: number) => (
                <CardComponent key={key}
                    title={cloth.CLOTHES_NAME ?? ''}
                    description={cloth.CLOTHES_DESCRIPTION ?? ''}
                    url={cloth.CLOTHES_IMAGE ?? ''}
                    ID={cloth.ID ?? 0}
                    star={5}
                    branch={cloth.BRANCH_NAME ?? ''}
                    onCardClick={HandleClickCard} />
            ))}
        </div>
    )
}

export default ListProductForm