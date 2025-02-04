'use client'
import React from 'react'
import CardComponent from '../components/CardComponent'
import { CardItem } from '../models/CardItem'

const page = () => {

    function HandleClick(card: CardItem | undefined): void {
        console.log(card)
    }

    return (
        <CardComponent title={'EQT Pro'} description={'jaksfgajkshfgdajksdhajskdhjk'}
            branch='Nike'
            url={'https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-9.jpg'} ID={0} star={4.5}
            onCardClick={HandleClick} />
    )
}

export default page