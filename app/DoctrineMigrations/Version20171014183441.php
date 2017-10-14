<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171014183441 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE `ground_parts` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `ground_id` int(6) UNSIGNED NOT NULL,
            `number` VARCHAR(255) NOT NULL,
            `line` VARCHAR(255) NOT NULL,
            `ground_number` VARCHAR(255) NOT NULL,
            `deleted` int(1) UNSIGNED NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `ground_parts`;
        ');
    }
}
