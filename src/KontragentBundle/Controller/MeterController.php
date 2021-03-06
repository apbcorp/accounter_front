<?php

namespace KontragentBundle\Controller;

use CoreBundle\Controller\BaseEntityController;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;

class MeterController extends BaseEntityController
{
    /**
     * @var string
     */
    protected $entity = Meter::class;

    /**
     * @Route("/meter/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function getAction($id)
    {
        return parent::getAction($id);
    }

    /**
     * @Route("/list/meter")
     * @Method("GET")
     * @var Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        return parent::listAction($request);
    }

    /**
     * @Route("/meter/delete/{id}")
     * @Method("GET")
     * @var int $id
     * @return JsonResponse
     */
    public function deleteAction($id)
    {
        return parent::deleteAction($id);
    }

    /**
     * @Route("/meter/{id}")
     * @Method("POST")
     * @var Request $request
     * @var int     $id
     * @return JsonResponse
     */
    public function patchAction(Request $request, $id)
    {
        return parent::patchAction($request, $id);
    }

    /**
     * @Route("/meter")
     * @Method("POST")
     * @var Request $request
     * @return JsonResponse
     */
    public function postAction(Request $request)
    {
        return parent::postAction($request);
    }

    /**
     * @Route("/supply/meter")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function supplyAction(Request $request)
    {
        return parent::suppplyAction($request);
    }

    /**
     * @Route("/meter_by_ground/{id}")
     * @Method("GET")
     * @param Request $request
     * @param int     $id
     * @return JsonResponse
     */
    public function getMeterByGroundAction(Request $request, $id)
    {
        $groundRef = $this->getDoctrine()->getManager()->getReference(Ground::class, $id);

        return $this->sendResponse($this->getRepository()->findBy(['ground' => $groundRef, 'deleted' => false]), Response::HTTP_OK);
    }
}